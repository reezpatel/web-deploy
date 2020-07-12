const yargs = require("yargs");
const { createServer, connect, disconnect, init, deploy } = require("../lib");

function validate(value, fn) {
  if ((!fn && value) || (fn && fn(value))) {
    return;
  }
  yargs.showHelp();
  process.exit(0);
}

const args = yargs
  .usage("usage: $0 <command> [options]")
  .command("start", "Start a new Server", (yargs) => {
    const _arg = yargs.options({
      p: {
        alias: "port",
        describe: "Server Port",
        default: 8080,
        type: "number",
      },
    }).argv;
    validate(_arg.p, Number.parseInt);
  })
  .command("connect", "Connect to server", (yargs) => {
    yargs
      .options({
        host: {
          describe: "Server Host",
          default: "http://127.0.0.1:9090",
          type: "string",
        },
        t: {
          alias: "token",
          describe: "Authentication Token",
          type: "string",
        },
      })
      .demandOption("host")
      .demandOption("token");
  })
  .command("disconnect", "Disconnect from a server")
  .command("init", "Initialize a new config", (yargs) => {
    yargs.positional("path", {
      describe: "Path to initialize config",
      default: ".",
    });
  })
  .command("deploy", "Deploy a build", (yargs) => {
    yargs.positional("path", {
      describe: "Path to initialize config",
      default: ".",
    });
  })
  .help("h")
  .alias("h", "help").argv;

validate(args._.length > 0);

switch (args._[0]) {
  case "start": {
    return createServer(args);
  }
  case "connect": {
    return connect(args);
  }
  case "disconnect": {
    return disconnect(args);
  }
  case "init": {
    return init({ ...args, path: args._[1] || "." });
  }
  case "deploy": {
    return deploy({ ...args, path: args._[1] || "." });
  }
  default: {
    console.log(args);
    yargs.showHelp();
  }
}
