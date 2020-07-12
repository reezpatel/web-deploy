const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
// const getDomain = require("getdomain");

const connect = async ({ host, token }) => {
  try {
    const url = `${host}/__page_deploy__`;

    const uri = new URL(host);

    // const domain = getDomain.get(host);

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ token }),
    }).then((r) => r.json());

    if (response.status === "SUCCESS" && response.message === "OK") {
      console.log(`Connected to ${host}`);
      console.warn("Warn: Token is saved in local machine in raw format");
      console.warn("Warn: Make sure to disconnect when run in ci environment");

      fs.writeFileSync(
        path.join(__dirname, "..", "..", "token"),
        JSON.stringify([{ host: uri.host, token }])
      );

      return true;
    }
    console.error(`Failed to connect to ${host}`, response.message);
  } catch (e) {
    console.error(`Failed to connect to server`, e.message);
  }
};

const disconnect = () => {
  fs.unlinkSync(path.join(__dirname, "..", "..", "token"));
  console.log("Removed authenticated server");
};

module.exports = {
  connect,
  disconnect,
};
