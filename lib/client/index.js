const init = require("./init");
const deploy = require("./deploy");
const { connect, disconnect } = require("./connection");

module.exports = {
  connect,
  disconnect,
  init,
  deploy,
};
