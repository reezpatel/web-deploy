const http = require("http");
const formidable = require("formidable");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 */
const getBody = (req) => {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.from("");
    req.on("data", (chunk) => {
      buffer = buffer + chunk;
    });
    req.on("end", () => {
      resolve(buffer.toString("utf-8"));
    });
    req.on("error", (e) => {
      reject(e);
    });
  });
};

/**
 * @param {http.ServerResponse} res
 */
const reply = (res, responseCode, success, message) => {
  const str = JSON.stringify({
    status: success ? "SUCCESS" : "FAILED",
    message,
  });

  res.writeHead(responseCode, {
    "Content-Length": str.length,
    "Content-Type": "application/json",
  });

  res.end(str);
};

/**
 * @param {http.ServerResponse} res
 */
const replyFile = (res, size, file) => {
  res.writeHead(200, {
    "Content-Length": size,
  });
  fs.createReadStream(file).pipe(res);
};

/**
 * @param {string} token
 * @param {http.ServerResponse} res
 */
const validate = (token, res) => {
  if (!token || !token === process.env.TOKEN) {
    reply(res, 401, false, `INVALID_TOKEN`);
    return false;
  }
  return true;
};

/**
 * @param {http.IncomingMessage} req
 */
const parseMultipart = (req) => {
  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        fields,
        files,
      });
    });
  });
};

module.exports = {
  getBody,
  reply,
  replyFile,
  validate,
  parseMultipart,
};
