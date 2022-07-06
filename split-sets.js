const fs = require("fs");

let tokensObj = {};

// read JSON object from file
fs.readFile("figma-tokens.json", "utf-8", (err, data) => {
  if (err) {
    throw err;
  }

  tokensObj = JSON.parse(data.toString());

  Object.entries(tokensObj).forEach(([setName, setValues]) => {
    const folder=setName.includes("component")?"components":"themes"
    const path = `tokens/${setName}`
    if (path.split("/").length > 2) {
        path.split("/").slice(0, -1).reduce(
            (directories, directory) => {
                directories += `${directory}/`;
            
                if (!fs.existsSync(directories)) {
                fs.mkdirSync(directories);
                }
            
                return directories;
            },
            '',
        );
    }
    // write JSON string to a file
    fs.writeFile(`source/${folder}/${setName}.json`, JSON.stringify(setValues, null, 2), (err) => {
      if (err) {
        throw err;
      }
    });
  });
  
});