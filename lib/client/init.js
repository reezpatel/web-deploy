const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const deployProject = require("./deploy");

const init = ({ path: _path }) => {
  console.log(_path);
  const config = [
    {
      host: "http://www.example.com",
      path: "build",
      cors: "*",
      ttl: "",
      entryPoint: "index.html",
      404: "index.html",
    },
  ];
  fs.writeFileSync(
    path.join(_path, ".deploy"),
    JSON.stringify(config, null, 2)
  );
};

module.exports = init;
