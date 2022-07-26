module.exports = function formatKey(word, searchValue, newValue = "") {
  let regEx = new RegExp(searchValue, "i");
  let name = word.replace(regEx, newValue);
  let key = name.charAt(0).toLowerCase() + name.slice(1);
  return key;
};
