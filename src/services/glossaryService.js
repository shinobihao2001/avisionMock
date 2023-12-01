const { Page } = require("openai/pagination");
const glossaryModel = require("../models/glossary");
const pageService = require("./pageService");
const link = require("../models/link");

module.exports = {
  async replaceOnePage(name) {
    let page = pageService.getPage(name);
    let glossary = await glossaryModel.find({ enLink: name }).exec();
    console.log(glossary);
  },
};
