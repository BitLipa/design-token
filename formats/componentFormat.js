const filterDictionary = require("style-dictionary/lib/filterProperties");
const minifyDictionaryComponent = require("../helpers/minifyDictionaryComponent");

module.exports = ({ dictionary, file }) => {
  return `export default ${JSON.stringify(
    minifyDictionaryComponent(
      Object.values(filterDictionary(dictionary, file.filterBy).properties)[0],
      dictionary
    ),
    null,
    2
  )}`;
};
