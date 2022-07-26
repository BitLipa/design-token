const { exec } = require("child_process");
const fs = require("fs");

const sets = [];

fs.readFile("figma-tokens.json", "utf-8", (err, data) => {
  if (err) {
    throw err;
  }

  const tokensObj = JSON.parse(data.toString());

  Object.entries(tokensObj).forEach(([setName, setValues]) =>
    sets.push(setName)
  );

  const fiteredSets = sets.filter(
    (s) => !(s.includes("component") || s.includes("theme"))
  );

  sets.map((set) => {
    const isComponent = set.includes("component");
    const isTheme = set.includes("theme");
    const include =
      isComponent || isTheme
        ? `${fiteredSets.join(",")},${set}`
        : fiteredSets.join(",");
    const exclude =
      isComponent || isTheme
        ? fiteredSets.join(",")
        : fiteredSets.filter((s) => s !== set).join(",");
    const path = isComponent ? "components" : "themes";
    const options = isComponent
      ? "--preserveRawValue=true --resolveReferences=false --throwErrorWhenNotResolved=false"
      : "--throwErrorWhenNotResolved=false";
    const cmd = `token-transformer figma-tokens.json tokens/${path}/${set}.json ${include} ${exclude} ${options}`;

    exec(cmd);
  });
});
