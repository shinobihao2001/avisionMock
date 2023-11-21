const contentModel = require("./models/content");
const translate = require("./transAPI");
const Crawler = require("crawler");

async function createContent(node, url) {
  await contentModel.create({
    url: url,
    tagName: node.prop("tagName"),
    text: node.text().replace(/\s+/g, " "),
    newText: node.text().replace(/\s+/g, " ") + " - translated ",
  });
}

const crawler = new Crawler({
  maxConnections: 10,
  callback: (error, res, done) => {
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      var doc = $(".elementor-widget-container");
      doc.each(async (index, element) => {
        let content = $(element).text().trim();
        if (content) {
          if ($(element).children(":not(br)").length == 0) {
            let node = $(element);
            await createContent(node, res.options.uri);
          }
          $(element)
            .find("*")
            .each(async (index, childNode) => {
              let node = $(childNode);
              if (node.children(":not(br)").length == 0)
                if (node.text().trim()) {
                  await createContent(node, res.options.uri);
                }
            });
        }
      });
    }
    done();
  },
});

module.exports = {
  crawlingOnePage: async function (url) {
    crawler.queue(url);
  },

  crawlingAllPage: async function (links) {
    links.forEach((link) => {
      crawler.queue(link);
    });
  },

  findTranslatedWord: async function (world) {
    let result = await contentModel
      .findOne({
        text: world,
      })
      .exec();
    return result ? result.newText : "not found";
  },

  translateDb: async function () {
    const allContents = await contentModel.find();
    for (var content of allContents) {
      console.log("Câu nhận vào: " + content.text);
      let newText = await translate(content.text);
      console.log("Câu được dịch: " + newText);
      content.newText = newText;
      await content.save().catch((err) => console.log(err));
      await new Promise((resolve) => setTimeout(resolve, 30000));
      console.log("Đã đợi xong 30s");
    }
  },
};
