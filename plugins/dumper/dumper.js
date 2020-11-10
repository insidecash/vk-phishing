const { join } = require("path");
const { download, parallel, findBiggestSize } = require("./utils");

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
