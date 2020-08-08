const fetch = require("node-fetch").default;
const { join } = require("path");
const { writeFile } = require("fs").promises;

/**
 * @param {string} directory
 * @param {import("vk-io").PhotosPhoto[]} photos
 */
module.exports.photos = async (directory, photos) => {
  for (const photo of photos) {
    const path = join(directory, `${photo.owner_id}_${photo.id}.jpg`);

    // eslint-disable-next-line unicorn/no-reduce
    const { url } = photo.sizes.reduce((sz1, sz2) =>
      sz1.width * sz1.height > sz2.width * sz2.height ? sz1 : sz2
    );

    const content = await fetch(url).then(response => response.buffer());

    await writeFile(path, content);
  }
};
