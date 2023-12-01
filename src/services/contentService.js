const contentModel = require("../models/content");
const transAPI = require("./transAPI");
const Crawler = require("crawler");
const fs = require("fs");
const Cheerio = require("cheerio");
require("dotenv").config();

// async function createContent(node, url) {
//   await contentModel.create({
//     // url: url,
//     //  tagName: node.prop("tagName"),
//     text: node.text().replace(/\s+/g, " "),
//     newText: node.text().replace(/\s+/g, " ") + " - translated ",
//     isTranslated: false,
//   });
// }

// function createOb(node, url) {
//   return {
//     // url: url,
//     // tagName: node.prop("tagName"),
//     text: node.text().replace(/\s+/g, " "),
//     newText: node.text().replace(/\s+/g, " ") + " - translated ",
//     isTranslated: false,
//   };
// }

const crawler = new Crawler({
  maxConnections: 50,
  rateLimit: 5000,
});

function getPageAsync(urls, crawler) {
  return new Promise((resolve, reject) => {
    let words = new Set();
    const loop = urls.map((url) => {
      return new Promise((resolve, reject) => {
        crawler.queue([
          {
            uri: url,
            callback: (error, res, done) => {
              if (error) {
                reject(error);
                console.log(error);
              } else {
                const $ = res.$;
                //const $ = Cheerio.load(res.body);

                //fs.writeFileSync("fileHtml.html", $.html());
                var doc = $(process.env.SELECT_TAGS).not("style, script");
                for (let index = 0; index < doc.length; index++) {
                  console.log(doc.length);
                  let element = doc.eq(index);
                  let content = element.text().trim();
                  if (content) {
                    if (
                      element.children(":not(br):not(strong):not(span):not(i)")
                        .length == 0
                    ) {
                      let node = $(element);
                      // await createContent(node, res.options.uri);
                      words.add(node.text().replace(/\s+/g, " "));
                    }

                    let children = element.find("*").not("style, script");
                    for (
                      let childIndex = 0;
                      childIndex < children.length;
                      childIndex++
                    ) {
                      let childNode = children.eq(childIndex);
                      let node = $(childNode);
                      if (
                        node.children(":not(br):not(strong):not(span):not(i)")
                          .length == 0
                      )
                        if (node.text().trim()) {
                          //await createContent(node, res.options.uri);
                          words.add(node.text().replace(/\s+/g, " "));
                        }
                    }
                  }
                }

                // });
              }
              resolve(words);
              done();
            },
          },
        ]);
      });
    });
    crawler.once("error", (error) => reject(error));
    crawler.once("drain", () => {
      Promise.all(loop).then((results) => {
        resolve(results[0]);
      });
    });
  });
}

module.exports = {
  crawlingOnePage: async function (url, crawler) {
    let result = await getPageAsync([url], crawler);
    return result;
  },

  crawlingAllPage: async function (links) {
    //console.log(links);
    let uniqueWords = new Set();

    //let count = 0;
    for (let link of links) {
      // count++;
      console.log(`start crawling: ${link}`);
      let result = await this.crawlingOnePage(link, crawler);
      //console.log(result);
      //console.log("ressult: " + Array.from(result));
      uniqueWords = new Set([...uniqueWords, ...result]);
      console.log("Uniqueword: " + Array.from(uniqueWords));
      console.log(`finish crawling: ${link}`);
      // if (count > 0) {
      //   break;
      // }
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
        isTranslated: false,
      });
    }

    return "Done";
  },

  findTranslatedWord: async function (word) {
    let result = await contentModel
      .findOne({
        $or: [
          {
            text: word,
          },
          {
            newText: word,
          },
        ],
      })
      .exec();
    return result ? result.newText : "not found " + word;
  },

  translateDb: async function () {
    const allContents = await contentModel.find();
    for (var content of allContents) {
      if (!content.isTranslated) {
        console.log("Câu nhận vào: " + content.text);
        let newText = await transAPI.translateGoogle(content.text);
        console.log("Câu được dịch: " + newText);
        content.newText = newText;
        content.isTranslated = true;
        await content.save().catch((err) => console.log(err));
      }
      console.log(content.text + " Đã được dịch");
      // Cái này khi xài chat gpt
      //await new Promise((resolve) => setTimeout(resolve, 30000));
      //console.log("Đã đợi xong 30s");
    }
  },

  checkAll: async function () {
    let contents = await contentModel.find();
    for (let content of contents) {
      content.isTranslated = true;
      console.log("Check: " + content.text);
      await content.save();
    }
  },
};
