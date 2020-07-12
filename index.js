require("./cli");

process.on("unhandledRejection", (e) => {
  console.log(e.stack);
});
