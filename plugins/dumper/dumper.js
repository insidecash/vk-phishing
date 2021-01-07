/* eslint-disable no-case-declarations */
const { join } = require("path");
const {
  download,
  parallel,
  findBiggestSize,
  renderTemplate,
  photoSizes2Html,
  writeFile,
  createHTML,
  mkdir,
  sleep,
  writeJSON
} = require("./utils");
const { VK } = require("vk-io");
const {
  isMainThread,
  Worker,
  workerData,
  parentPort
} = require("worker_threads");
const { join: pathJoin } = require("path");

const dumper = module.exports;
const log = require("./logger");

/**
 * @param {string} directory
 * @param {import("vk-io").PhotosPhoto[]} photos
 */
module.exports.downloadPhotos = (directory, photos) =>
  parallel(async photo => {
    const path = join(directory, `${photo.owner_id}_${photo.id}.jpg`);

    // eslint-disable-next-line unicorn/no-reduce
    const { url } = findBiggestSize(photo.sizes);

    await download(url, path);
  }, photos);

/**
 *
 * @param {import('vk-io').VK} vk
 * @returns {Promise<import('vk-io').UsersUserXtrCounters>}
 */
module.exports.getMe = async vk => {
  const [me] = await vk.api.users.get({
    fields: [
      "about",
      "activities",
      "bdate",
      "books",
      "career",
      "city",
      "common_count",
      "connections",
      "contacts",
      "counters",
      "country",
      "crop_photo",
      "descriptions",
      "domain",
      "education",
      "exports",
      "followers_count",
      "games",
      "has_mobile",
      "has_photo",
      "home_town",
      "interests",
      "lists",
      "maiden_name",
      "military",
      "movies",
      "nickname",
      "occupation",
      "lists",
      "personal",
      "photo_max_orig",
      "photo_100",
      "quotes",
      "relatives",
      "schools",
      "screen_name",
      "sex",
      "site",
      "status",
      "timezone",
      "tv",
      "universities",
      "verified",
      "wall_comments"
    ]
  });

  return me;
};

/**
 *
 * @param {import('vk-io').VK} vk
 * @returns {Promise<import('vk-io').FriendsGetResponse>}
 */
module.exports.getFriends = async vk => {
  return await vk.api.friends.get({
    count: 5000,
    fields: [
      "nickname",
      "domain",
      "sex",
      "bdate",
      "city",
      "country",
      "timezone",
      "photo_200_orig",
      "contacts",
      "education",
      "relation",
      "last_seen",
      "status",
      "can_post",
      "universities"
    ]
  });
};

/**
 *
 * @param {import('vk-io').VK} vk
 * @param {import('vk-io/lib/api/schemas/objects').PhotosPhotoAlbumFull} album
 * @param {string} path
 *
 * @returns {Promise<void>}
 */
module.exports.dumpAlbum = async (vk, album, path) => {
  const { items: photos } = await vk.api.photos.get({
    album_id: album.id,
    count: 1000
  });

  /**
   * @type {string[]}
   */
  const photosHtml = [];

  for (const photo of photos) {
    const html = await renderTemplate("photos_photo", {
      ...findBiggestSize(photo.sizes),
      srcset: photoSizes2Html(photo.sizes),
      text: photo.text
    });

    photosHtml.push(html);
  }

  const html = await renderTemplate("album_template", {
    ...album,
    photos: photosHtml
  });

  if (path.endsWith("/")) path = path.slice(0, Math.max(0, path.length - 1));

  await writeFile(`${path}.html`, createHTML(`Photos in ${album.title}`, html));
};

const dump = token => {
  const worker = new Worker(__filename, { workerData: { token } });

  return new Promise((resolve, reject) => {
    worker.once("message", resolve);
    worker.once("error", reject);
  });
};

module.exports.dump = dump;

if (!isMainThread) {
  const { token } = workerData;
  const vk = new VK({ token });

  work(vk)
    .then(data => parentPort.postMessage(data))
    .catch(error => {
      throw error;
    });
}

/**
 *
 * @param {VK} vk
 */
async function work(vk) {
  const me = await dumper.getMe(vk);

  log.kw("Dumping", `${me.first_name} ${me.last_name}`);

  const dumpsDirectory = pathJoin(
    __dirname,
    "..",
    "..",
    "dumps",
    `${me.first_name} ${me.last_name} @${me.screen_name || "id" + me.id}`
  );

  await mkdir(dumpsDirectory);

  await writeJSON(pathJoin(dumpsDirectory, "user.json"), me);
  log.kw("Dumping Section", "Friends");

  const friends = await dumper.getFriends(vk);
  log.message(`${me.first_name} ${me.last_name} has ${friends.count} friends`);

  await writeJSON(pathJoin(dumpsDirectory, "friends.json"), friends);
  await sleep(3000);

  log.kw("Dumping Section", "Photos");
  await mkdir(pathJoin(dumpsDirectory, "albums"));

  const { items: albums } = await vk.api.photos.getAlbums({
    need_system: true
  });

  for (const album of albums) {
    const albumTitle = album.title.replace(/(\\|\/)/g, "|");

    const albumPath = pathJoin(dumpsDirectory, "albums", albumTitle);
    // await mkdir(albumPath);

    await writeJSON(`${albumPath}.json`, album);

    log.secondaryMessage(albumTitle, "+");
    try {
      await dumper.dumpAlbum(vk, album, albumPath);
    } catch {
      log.error(`Unable to dump album: ${album.title}`);
    }
  }

  log.kw("Dumping Section", "Dialogs");

  await mkdir(pathJoin(dumpsDirectory, "dialogs"));

  const {
    items: dialogs,
    profiles,
    groups
  } = await vk.api.messages.getConversations({
    count: 200,
    filter: "all",
    extended: true
  });

  await writeJSON(pathJoin(dumpsDirectory, "dialogs", "groups.json"), groups);

  await writeJSON(
    pathJoin(dumpsDirectory, "dialogs", "profiles.json"),
    profiles
  );

  for (const { conversation } of dialogs) {
    try {
      const { peer } = conversation;
      let dialogTitle = "untitled";

      switch (peer.type) {
        case "chat":
          dialogTitle = conversation.chat_settings.title;
          break;
        case "group":
          dialogTitle = groups.find(group => group.id === peer.local_id).name;
          break;
        case "user":
          // eslint-disable-next-line no-case-declarations
          const companion = profiles.find(
            profile => profile.id === peer.local_id
          );

          dialogTitle = `${companion.first_name} ${companion.last_name}`;
          break;
      }

      log.kw("Dialog", dialogTitle);

      // Чтобы не ломалась структура папок
      dialogTitle = dialogTitle.replace(/(\/|\\)/g, "|");
      log.kw("Dialog dir", dialogTitle);

      const dialogDirectory = pathJoin(
        dumpsDirectory,
        "dialogs",
        `${dialogTitle} ${peer.type}${peer.local_id}`
      );

      await mkdir(dialogDirectory);

      //#region Photos
      log.secondaryMessage("Photos", "+");

      const { items: photos } = await vk.api.messages.getHistoryAttachments({
        count: 200,
        peer_id: peer.id,
        media_type: "photo",
        max_forwards_level: 10
      });

      // await mkdir(pathJoin(dialogDirectory, "photos"));

      // await dumper.downloadPhotos(
      //   pathJoin(dialogDirectory, "photos"),
      //   photos.map(photo => photo.attachment.photo)
      // );

      const photosHtml = await Promise.all(
        photos.map(x => {
          const photo = x.attachment.photo;

          return renderTemplate("photos_photo", {
            ...findBiggestSize(photo.sizes),
            srcset: photoSizes2Html(photo.sizes),
            text: photo.text
          });
        })
      ).then(photos =>
        renderTemplate("photos_template", { photos, dialogTitle, peer })
      );

      await writeFile(
        pathJoin(dialogDirectory, `Photos ${dialogTitle}.html`),
        createHTML(`Photos in ${dialogTitle}`, photosHtml)
      );
      //#endregion

      //#region Videos
      log.secondaryMessage("Videos", "+");
      const {
        items: videosHistoryAttachments
      } = await vk.api.messages.getHistoryAttachments({
        count: 200,
        peer_id: peer.id,
        media_type: "video",
        max_forwards_level: 10
      });

      const videoIds = videosHistoryAttachments.map(video =>
        [
          video.attachment.video.owner_id,
          video.attachment.video.id,
          video.attachment.video.access_key
        ].join("_")
      );

      const { items: videos } = await vk.api.video.get({ videos: videoIds });

      const videosHtml = [];

      for (const video of videos) {
        const html = await renderTemplate("videos_video", {
          ...findBiggestSize(video.image),
          video
        });

        videosHtml.push(html);
      }

      await writeFile(
        pathJoin(dialogDirectory, `Videos ${dialogTitle}.html`),
        createHTML(
          `Videos in ${dialogTitle}`,
          await renderTemplate("videos_template", {
            dialogTitle,
            peer,
            html: videosHtml.join("\n")
          })
        )
      );
      //#endregion

      //#region Messages
      log.secondaryMessage("Messages", "+");
      const { items: messages } = await vk.api.messages.getHistory({
        count: 200,
        peer_id: peer.id
      });
      await writeJSON(pathJoin(dialogDirectory, "messages.json"), messages);

      let messagesHTML = "";

      for (const message of messages) {
        const person = (() => {
          if (message.from_id === me.id) {
            return {
              name: `${me.first_name} ${me.last_name}`,
              ava: me.photo_100
            };
          }

          const person = profiles.find(p => p.id === message.from_id);

          if (person) {
            return {
              name: `${person.first_name} ${person.last_name}`,
              ava: person.photo_100
            };
          }

          const group = groups.find(g => g.id === -message.from_id);

          if (group) {
            return { name: group.name, ava: group.photo_100 };
          }

          if (peer.type !== "chat") {
            return {
              name: dialogTitle,
              ava: "https://vk.com/images/deactivated_100.png"
            };
          }

          return {
            name: String(message.from_id),
            ava: "https://vk.com/images/deactivated_100.png"
          };
        })();

        const date = new Date(message.date * 1000);
        await writeJSON(pathJoin(dialogDirectory, "messages.json"), messages);

        const attachments = message.attachments || [];
        let attachmentsHtml = "";

        if (attachments.length > 0) {
          for (const attachment of attachments) {
            switch (attachment.type) {
              case "photo":
                const { photo } = attachment;

                attachmentsHtml += await renderTemplate("photo_attachment", {
                  ...findBiggestSize(photo.sizes),
                  peer,
                  text: photo.text,
                  photoLinkZ: `photo${photo.owner_id}_${photo.id}%2Fmail${message.id}`
                });
                break;

              case "sticker":
                const { sticker } = attachment;

                attachmentsHtml += await renderTemplate("sticker_attachment", {
                  ...findBiggestSize(sticker.images),
                  peer,
                  message
                });
                break;

              case "wall":
                const { wall } = attachment;

                attachmentsHtml += `<a href="https://vk.com/wall${
                  wall.owner_id || wall.from_id
                }_${wall.id}_${wall.access_key}" target="_blank">
                  Wall post
                </a>`;
                break;

              case "audio_message":
                attachmentsHtml += await renderTemplate(
                  "audio_message_attachment",
                  {
                    ...attachment.audio_message,
                    transcript_done:
                      attachment.audio_message.transcript_state === "done"
                  }
                );
                break;

              case "video":
                const { video } = attachment;

                attachmentsHtml += await renderTemplate("video_attachment", {
                  ...findBiggestSize(video.image),
                  video,
                  videoLinkZ: `video${video.owner_id}_${video.id}%2Fmail${message.id}`,
                  peer
                });
                break;

              case "link":
                attachmentsHtml += await renderTemplate("link_attachment", {
                  ...attachment.link
                });

                break;

              default:
                attachmentsHtml += `<pre>${JSON.stringify(
                  attachment,
                  undefined,
                  2
                )}</pre>`;
                break;
            }
          }
        }

        messagesHTML += await renderTemplate("message", {
          person,
          message,
          attachments: attachmentsHtml,
          date: date
            .toISOString()
            .replace("T", " ")
            .replace("Z", "")
            .replace(".000", "")
        });
      }

      await writeFile(
        pathJoin(dialogDirectory, `Messages ${dialogTitle}.html`),
        createHTML(
          `Messages in chat - ${dialogTitle}`,
          await renderTemplate("messages_template", {
            peer,
            html: messagesHTML,
            dialogTitle
          })
        )
      );

      //#endregion
    } catch (error) {
      log.error("Unable to dump dialog:", error);
    }
  }

  return { Allah: true };
}
