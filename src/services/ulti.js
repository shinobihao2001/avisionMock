module.exports = {
  getLocalName(name) {
    let localname = name
      .toString()
      .slice(27)
      .replaceAll("/", "_")
      .replaceAll("-", "_");

    return localname ? localname : "mainPage";
  },
};
