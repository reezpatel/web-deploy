const path = require("path");
const fs = require("fs");
const tar = require("tar-fs");
const { createIfNotPresent } = require("../../utils/file");

const storeInLocalStorage = async (basePath, site, config, tarFile) => {
  return new Promise(async (resolve) => {
    try {
      const folder = path.join(basePath, site);

      await createIfNotPresent(folder);

      fs.createReadStream(tarFile)
        .pipe(tar.extract(folder))
        .on("finish", () => {
          resolve();
        });
    } catch (e) {
      console.error("Error", e);
      return e;
    }
  });
};

module.exports = {
  storeInLocalStorage,
};
