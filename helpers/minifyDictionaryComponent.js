const formatKey = require("./formatKey");

module.exports = function minifyDictionaryComponent(obj, dictionary) {
  let toRet = {};
  if (typeof obj !== "object" || Array.isArray(obj)) {
    return obj;
  }

  if (obj.hasOwnProperty("value")) {
    if (
      dictionary.usesReference(obj.original.value) &&
      (obj.original.type?.includes("color") || obj.type?.includes("color"))
    ) {
      const refs = dictionary.getReferences(obj.original.value);
      return formatKey(refs[0].name, refs[0].attributes.category);
    }
    return obj.value;
  } else if (typeof obj === "object") {
    for (let name in obj) {
      if (obj.hasOwnProperty(name)) {
        toRet[name] = minifyDictionaryComponent(obj[name], dictionary);
      }
    }
  }
  return toRet;
};
