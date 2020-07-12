const http = require("http");
const handlePost = require("./post");
const handlePut = require("./put");
const { reply } = require("../../utils/request");
const handleGet = require("./get");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const requestListener = (req, res) => {
  switch (req.method) {
    case "GET": {
      handleGet(req, res);
      break;
    }
    case "POST": {
      handlePost(req, res);
      break;
    }
    case "PUT": {
      handlePut(req, res);
      break;
    }
    case "DELETE": {
      reply(res, 405, false, "NOT_ALLOWED");
      break;
    }
    default: {
      reply(res, 405, false, "NOT_ALLOWED");
    }
  }
};

const createServer = (options) => {
  //   if (!fs.existsSync(public)) {
  //     console.error(`${public} doesn't exists. Exiting`);
  //     process.exit(100);
  //   }

  const server = http.createServer(requestListener);
  server.listen(options.port);
  console.log(`Server is UP... at ${options.port}`);
};

module.exports = {
  createServer,
};
