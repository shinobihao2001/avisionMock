const contentModel = require("../models/content");
const transAPI = require("./transAPI");
const Cheerio = require("cheerio");
const linkService = require("./linkService");
const gloosaryService = require("./glossaryService");
require("dotenv").config();

async function getWordFormPage(page) {
  const $ = Cheerio.load(page);
  //console.log(page);
  let words = new Set();

  var doc = $(process.env.SELECT_TAGS).not("style, script");
  for (let index = 0; index < doc.length; index++) {
    console.log(doc.length);
    let element = doc.eq(index);
    let content = element.text().trim();
    if (content) {
      if (
        element.children(":not(br):not(strong):not(span):not(i)").length == 0
      ) {
        let node = $(element);
        // await createContent(node, res.options.uri);
        words.add(node.text().replace(/\s+/g, " "));
      }

      let children = element.find("*").not("style, script");
      for (let childIndex = 0; childIndex < children.length; childIndex++) {
        let childNode = children.eq(childIndex);
        let node = $(childNode);
        if (node.children(":not(br):not(strong):not(span):not(i)").length == 0)
          if (node.text().trim()) {
            //await createContent(node, res.options.uri);
            words.add(node.text().replace(/\s+/g, " "));
          }
      }
    }
  }
  return words;
}

module.exports = {
  crawlingOnePage: async function (link) {
    let page = linkService.getOriginalPage(link);
    let result = getWordFormPage(page);
    return result;
  },

  crawlingAllPage: async function (links) {
    //console.log(links);
    let uniqueWords = new Set();

    for (let link of links) {
      console.log(`start crawling: ${link}`);
      let result = await this.crawlingOnePage(link);

      uniqueWords = new Set([...uniqueWords, ...result]);
      console.log("Uniqueword: " + Array.from(uniqueWords));
      console.log(`finish crawling: ${link}`);
    }
    //Get all the word in db in to a set
    let contents = await contentModel.find();
    let oldWords = new Set();
    for (let content of contents) {
      oldWords.add(content.text);
    }
    // console.log("Uniqueword: " + Array.from(uniqueWords));
    // console.log("Oldword: " + Array.from(oldWords));
    // get the word that not duplicated
    uniqueWords = new Set([...uniqueWords].filter((x) => !oldWords.has(x)));

    //add new wors to db
    let arr = Array.from(uniqueWords);
    // console.log("Array : " + arr);
    for (let i = 0; i < arr.length; i++) {
      await contentModel.create({
        text: arr[i].toString(),
        newText: arr[i].toString() + " - translated",
        finalText: arr[i].toString() + " - translated",
        isTranslated: false,
      });
    }

    return "Done";
  },

  findTranslatedWord: function (word, arrayDB) {
    let result = null;
    for (let content of arrayDB) {
      if (
        word == content.text ||
        word == content.newText ||
        word == content.finalText
      ) {
        result = content;
        break;
      }
    }
    return result ? result.finalText : "not found " + word;
  },

  translateDb: async function () {
    const allContents = await contentModel.find();
    const gloosaryArr = gloosaryService.getGlossaryCsv();

    for (var content of allContents) {
      if (!content.isTranslated) {
        console.log("Câu nhận vào: " + content.text);
        let newText = await transAPI.translateGoogle(content.text);
        console.log("Câu được dịch: " + newText);
        content.newText = newText;
        content.finalText = newText;
        content.isTranslated = true;
        await content.save().catch((err) => console.log(err));
      }
      //console.log(content.text + " Đã được dịch");
      //checking if text need to fix
      for (let i = 0; i < gloosaryArr.length; i++) {
        let wrong = content.finalText.toLowerCase().trim();
        let right = gloosaryArr[i][0].toLowerCase().trim();
        if (wrong.includes(right)) {
          let temp = content.finalText.replace(
            new RegExp(gloosaryArr[i][0], "gi"),
            gloosaryArr[i][1]
          );
          content.finalText = temp;
          await content.save().catch((err) => console.log(err));
          console.log(
            content.text + " Đã được sửa thành :" + content.finalText
          );
        }
      }
    }
  },

  checkAll: async function () {
    let contents = await contentModel.find();
    for (let content of contents) {
      content.finalText = content.newText;
      console.log("Check: " + content.text);
      await content.save();
    }
  },

  getContentArray: async function () {
    let contents = await contentModel.find({}).lean().exec();
    let result = [];
    for (let content of contents) {
      result.push({
        text: content.text,
        newText: content.newText,
        finalText: content.finalText,
        isTranslated: content.isTranslated,
      });
    }
    return result;
  },
};
