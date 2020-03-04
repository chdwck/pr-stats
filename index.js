#!/usr/bin/env nodejs
const { argv } = require("yargs");
require("dotenv").config();

const { prStats } = require("./src/prStats");
const { cycleTime } = require("./src/cycleTime");
const { stringToArr } = require("./src/utils");

(async () => {
  const func = argv._[0];

  switch (func) {
    case "stats":
      return handleStats();
    case "cycle":
      return handleCycleTime();
    default:
      return handleNoFunc(func);
  }
})();

async function handleCycleTime() {
  const { owner, repos, users, to, from } = argv;

  if (!owner) {
    console.log("You didn't provide an owner: ex: --owner=<github repo owner>");
    return;
  }

  if (!repos) {
    console.log(
      "You didn't provide any repos: ex: --repos=[<github repo names>]"
    );
    return;
  }

  const params = {
    owner,
    repos: stringToArr(repos),
    users: stringToArr(users),
    from,
    to
  };

  await cycleTime(params);
}

async function handleStats() {
  const { url } = argv;

  if (!url) {
    console.log("You didn't provide a url: ex: --url=<pr url>");
  }

  await prStats();
}

function handleNoFunc(func) {
  if (!func) {
    console.log("You didn't provide a function.");
    console.log("Options: \n\tstats\n\tcycle\n");
    return;
  }

  console.log("Invalid func");
  console.log("Options: \n\tstats\n\tcycle\n");
}
