const fs = require("fs");
const { p } = require("./promisify");

const createIfNotPresent = async (path) => {
  if (!(await p(fs.exists, path))) {
    await p(fs.mkdir, path);
  }
};

module.exports = {
  createIfNotPresent,
};
