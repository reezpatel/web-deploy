const path = require("path");
const { storeInLocalStorage } = require("./localstorage");
// const { storeInS3 } = require("./s3storage");

const public = path.join(process.env.WEB_STORE_PATH || __dirname, "public");

const storeProject = async (config, tarFile) => {
  try {
    const { host } = new URL(config.host);

    const [...errors] = await Promise.all([
      storeInLocalStorage(public, host, config, tarFile),
      // storeInS3(public, host, config, tarFile),
    ]);

    const error = errors.find(Boolean);
    if (error) {
      console.log(("Err=or0", error));
      throw new Error(error);
    } else {
      return true;
    }
  } catch (e) {
    console.log("Error", e);
    throw new Error(e);
  }
};

module.exports = {
  storeProject,
};
