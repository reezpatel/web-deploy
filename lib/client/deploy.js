const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const tar = require("tar-fs");
const FormData = require("form-data");

const deploy = async ({ path: _path }) => {
  const configPath = path.join(_path, ".deploy");

  if (!fs.existsSync(configPath)) {
    console.error(`Can't find .deploy file, did you create one?`);
    return;
  }

  const configs = JSON.parse(fs.readFileSync(configPath));

  for (config of configs) {
    const success = await deployProject(config, _path);

    if (!success) {
      console.error(`Failed to deploy at ${config.host}`);
    } else {
      console.error(`Deployed project at ${config.host}`);
    }
  }
  console.log("All done...");
};

const deployProject = async (config, basePath) => {
  return new Promise((resolve, reject) => {
    try {
      const uri = new URL(config.host);

      const buildPath = path.join(basePath, config.path);
      const tarPath = path.join(basePath, `${uri.host}.tar`);

      if (!fs.existsSync(buildPath) || !fs.statSync(buildPath).isDirectory) {
        console.error(`${buildPath} is not a directory`);
      }

      const stream = tar.pack(buildPath).pipe(fs.createWriteStream(tarPath));

      stream.on("finish", async () => {
        await uploadProject(config, tarPath);
        fs.unlinkSync(tarPath);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

const uploadProject = async (config, tarPath) => {
  const serverUrl = `${config.host}/__page_deploy__`;
  const tokens = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "..", "token"))
  );
  const token = tokens[0].token;

  const form = new FormData();
  form.append("config", JSON.stringify(config));
  form.append("token", token);
  form.append("tar", fs.createReadStream(tarPath));

  const response = await fetch(serverUrl, {
    method: "PUT",
    body: form,
  });

  if (response.status === 401) {
    console.error("Oops token is wrong :)");
  } else if (response.status !== 200) {
    const data = await response.text();
    console.error(
      `Error: Cant to server at ${config.host} => ${response.status}`,
      data
    );
  } else {
    const data = await response.json();

    if (data.status === "SUCCESS") {
      console.log(data.message);
      return true;
    } else {
      console.error(`Error: ${data.message}`);
    }
  }
  return false;
};

module.exports = deploy;
