const StyleDictionary = require("style-dictionary");
const filterDictionary = require("style-dictionary/lib/filterProperties");

const components = ["icon", "avatar", "currencyIcon"];

function formatKey(word, searchValue, newValue = "") {
  let regEx = new RegExp(searchValue, "i");
  let name = word.replace(regEx, newValue);
  let key = name.charAt(0).toLowerCase() + name.slice(1);
  return key;
}

function minifyDictionary(
  obj,
  dictionary,
  nested = false,
  reference = false,
  newObj = {}
) {
  if (typeof obj !== "object" || Array.isArray(obj)) {
    return obj;
  }

  if (obj.hasOwnProperty("value") && obj.hasOwnProperty("name")) {
    let value = "";
    let tokenCategory = nested ? obj.attributes.type : obj.attributes.category;
    let search = nested
      ? `${obj.attributes.category}${obj.attributes.type}`
      : obj.attributes.category;

    if (
      dictionary.usesReference(obj.original.value) &&
      reference &&
      (obj.original.type === "colors" || obj.type === "colors")
    ) {
      const refs = dictionary.getReferences(obj.original.value);
      value = formatKey(refs[0].name, refs[0].attributes.category);
    }

    const res = {
      value: {
        [formatKey(obj.name, search)]: value || obj.value,
      },
      category: tokenCategory,
    };

    return res;
  } else if (typeof obj === "object") {
    for (let name in obj) {
      if (obj.hasOwnProperty(name)) {
        const res = minifyDictionary(
          obj[name],
          dictionary,
          nested,
          reference,
          newObj
        );
        if (res.category) {
          newObj[res.category] = {
            ...newObj[res.category],
            ...res.value,
          };
        }
      }
    }
  }
  return newObj;
}

StyleDictionary.registerFormat({
  name: "darkJS",
  formatter: ({ dictionary, file }) => {
    return `export default ${JSON.stringify(
      minifyDictionary(
        filterDictionary(dictionary, file.filterBy).properties,
        dictionary,
        true
      ),
      null,
      2
    )}`;
  },
});

StyleDictionary.registerFormat({
  name: "miniJS",
  formatter: ({ dictionary, file }) => {
    return `export default ${JSON.stringify(
      minifyDictionary(
        filterDictionary(dictionary, file.filterBy).properties,
        dictionary
      ),
      null,
      2
    )}`;
  },
});

StyleDictionary.registerFormat({
  name: "compJS",
  formatter: ({ dictionary, file }) => {
    return `export default ${JSON.stringify(
      minifyDictionary(
        filterDictionary(dictionary, file.filterBy).properties,
        dictionary,
        false,
        true
      ),
      null,
      2
    )}`;
  },
});

module.exports = {
  source: ["tokens/**/*.json"],
  platforms: {
    ts: {
      transformGroup: `js`,
      transforms: ["attribute/cti", "name/cti/pascal"],
      buildPath: `build/`,
      files: [
        {
          format: `miniJS`,
          destination: `theme.ts`,
          filterBy: (token) => {
            return (
              token.attributes.category !== "dark" &&
              components.every((comp) => comp !== token.attributes.category)
            );
          },
          options: {
            outputReferences: true,
          },
        },
        {
          format: `darkJS`,
          destination: `dark-theme.ts`,
          options: {
            outputReferences: true,
          },
          filterBy: (token) => token.attributes.category === "dark",
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
};
