const { readdirSync } = require("fs");

const dirs = (p) => readdirSync(p).filter((p) => !p.includes("index"));
module.exports = dirs(__dirname);
