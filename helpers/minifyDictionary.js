const formatKey = require("./formatKey");

module.exports = function minifyDictionary(
  obj,
  dictionary,
  nested = false,
  newObj = {}
) {
  if (typeof obj !== "object" || Array.isArray(obj)) {
    return obj;
  }

  if (obj.hasOwnProperty("value") && obj.hasOwnProperty("name")) {
    let search = nested
      ? `${obj.attributes.category}${obj.attributes.type}`
      : obj.attributes.category;

    const res = {
      value: {
        [formatKey(obj.name, search)]: obj.value,
      },
      category: nested ? obj.attributes.type : obj.attributes.category,
    };

    return res;
  } else if (typeof obj === "object") {
    for (let name in obj) {
      if (obj.hasOwnProperty(name)) {
        const res = minifyDictionary(obj[name], dictionary, nested, newObj);
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
};
