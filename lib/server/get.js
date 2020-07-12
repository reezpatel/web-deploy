const fs = require("fs");
const path = require("path");
const { reply, replyFile } = require("../../utils/request");
const { p } = require("./../../utils/promisify");

const public = path.join(process.env.WEB_STORE_PATH || __dirname, "public");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const handleGet = async (req, res) => {
  try {
    const { host } = req.headers;
    if (!host || !(await p(fs.exists, path.join(public, host)))) {
      reply(res, 204, false, "");
      return;
    }

    const location = path.join(public, host, req.url);
    const status = await p(fs.stat, location);

    if (status.isDirectory()) {
      const fallbackPath = path.join(location, "index.html");

      if (!(await p(fs.exists, fallbackPath))) {
        reply(res, 404, false, "FALLBACK__NOT_FOUND");
        return;
      }

      const fallbackStatus = await p(fs.stat, fallbackPath);
      replyFile(res, fallbackStatus.size, fallbackPath);
      return;
    }

    if (status.isFile()) {
      replyFile(res, status.size, location);
      return;
    }

    reply(res, 404, false, "FILE_NOT_FOUND");
  } catch (e) {
    console.log("Failed to POST", e);
    reply(res, 500, false, `INVALID_BODY`);
  }
};

module.exports = handleGet;
