const StyleDictionary = require("style-dictionary");
const componentsFiles = require("./tokens/components");

const components = componentsFiles
  ?.map((comp) => comp.includes("component") && comp.split(".")[1])
  .filter((comp) => comp);
const themes = ["dark"];

const styleDictionary = StyleDictionary.extend({
  format: {
    mainJS: require("./formats/mainFormat"),
    compJS: require("./formats/componentFormat"),
  },
});

styleDictionary
  .extend({
    source: [`tokens/**/!(*.${themes.join("|*.")}).json`],
    platforms: {
      ts: {
        transformGroup: `js`,
        transforms: ["attribute/cti", "name/cti/pascal"],
        buildPath: `build/`,
        files: [
          {
            format: `mainJS`,
            destination: `theme.ts`,
            filterBy: (token) => {
              return (
                themes.every((theme) => theme !== token.attributes.category) &&
                components.every((comp) => comp !== token.attributes.category)
              );
            },
          },
          ...components.map((comp) => {
            return {
              format: `compJS`,
              destination: `${comp}-theme.ts`,
              options: {
                outputReferences: true,
              },
              filterBy: (token) => token.attributes.category === comp,
            };
          }),
        ],
      },
    },
  })
  .buildAllPlatforms();
styleDictionary
  .extend({
    include: [`tokens/**/!(*.${themes.join("|*.")}).json`],
    source: ["tokens/**/*.dark.json"],
    platforms: {
      ts: {
        transformGroup: `js`,
        transforms: ["attribute/cti", "name/cti/pascal"],
        buildPath: `build/`,
        files: [
          {
            format: `mainJS`,
            destination: `dark-theme.ts`,
            filterBy: (token) => token.filePath.indexOf(`.dark`) > -1,
          },
        ],
      },
    },
  })
  .buildAllPlatforms();
