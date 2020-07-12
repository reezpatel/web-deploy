const { getBody, reply, validate } = require("../../utils/request");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const handlePost = async (req, res) => {
  try {
    const body = JSON.parse(await getBody(req));

    if (validate(body.token, res)) {
      reply(res, 200, true, `OK`);
    }
  } catch (e) {
    console.log("Failed to POST", e);
    reply(res, 500, false, `INVALID_BODY`);
  }
};

module.exports = handlePost;
