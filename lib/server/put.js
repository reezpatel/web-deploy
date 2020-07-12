const { reply, parseMultipart, validate } = require("../../utils/request");
const { storeProject } = require("../storage");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const handlePut = async (req, res) => {
  try {
    const { fields, files } = await parseMultipart(req);
    const config = JSON.parse(fields.config);

    if (validate(fields.token, res)) {
      await storeProject(config, files.tar.path);
      reply(res, 200, true, "OK");
    }
  } catch (e) {
    console.log("Failed to PUT", e);
    reply(res, 500, false, `INVALID_BODY`);
  }
};

module.exports = handlePut;
