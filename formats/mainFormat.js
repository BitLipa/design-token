const filterDictionary = require("style-dictionary/lib/filterProperties");
const minifyDictionary = require("../helpers/minifyDictionary");

module.exports = ({ dictionary, file }) => {
  return `export default ${JSON.stringify(
    minifyDictionary(
      filterDictionary(dictionary, file.filterBy).properties,
      dictionary
    ),
    null,
    2
  )}`;
};
