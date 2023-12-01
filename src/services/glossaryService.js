const { Page } = require("openai/pagination");
const glossaryModel = require("../models/glossary");
const pageService = require("./pageService");
const link = require("../models/link");
const Cheerio = require("cheerio");
const fs = require("fs");
const { exec } = require("child_process");

async function replacePage(file, gloosary) {
  let $ = Cheerio.load(file);

  //replace old text with glossary text
  var doc = $(process.env.SELECT_TAGS).not("style, script");
  console.log(doc.length);
  for (let index = 0; index < doc.length; index++) {
    console.log(index);
    let element = doc.eq(index);
    let content = element.text().trim();

    if (content) {
      console.log(content.replace(/\s+/g, " "));
      if (
        element.children(":not(br):not(strong):not(span):not(i)").length == 0
      ) {
        let word = content.replace(/\s+/g, " ");
        let newWord = findContentInArray(word, gloosary);
        if (newWord) {
          $(element).text(newWord);
        }
      } else {
        const children = element.find("*").not("style, script");
        for (let childIndex = 0; childIndex < children.length; childIndex++) {
          let childNode = children.eq(childIndex);
          let node = $(childNode);
          if (
            node.children(":not(br):not(strong):not(span):not(i)").length ==
              0 &&
            node.text().trim()
          ) {
            let word = content.replace(/\s+/g, " ");
            let newWord = findContentInArray(word, gloosary);
            if (newWord) {
              $(element).text(newWord);
            }
          }
        }
      }
    }
  }

  const modifiedHtml = $.html();

  fs.writeFile("modified.html", modifiedHtml, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }

    console.log("File written successfully: modified.html");

    // Open the modified file in the default web browser (cross-platform)
    exec("start modified.html", (error, stdout, stderr) => {
      if (error) {
        console.error("Error opening file:", error);
      }
    });
  });
}

function changeToArray(obs) {
  let result = [];
  for (let ob of obs) {
    result.push({
      wrongContent: ob.wrongContent,
      rightContent: ob.rightContent,
    });
  }
  return result;
}

function findContentInArray(word, gloosaryArray) {
  for (let content of gloosaryArray) {
    if (word == content.wrongContent) {
      return content.rightContent;
    }
  }
  return null;
}

module.exports = {
  async replaceOnePage(name) {
    let page = await pageService.getPage(name);
    console.log(page);
    let glossary = await glossaryModel.find({ enLink: name }).exec();
    console.log(typeof glossary);
    console.log(glossary);
    let arrayGlossary = changeToArray(glossary);
    console.log("Array Form:");
    console.log(arrayGlossary);
    replacePage(page, arrayGlossary);
    if (glossary == null) {
      return "Done";
    }
  },
};
