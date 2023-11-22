const Crawler = require("crawler");
const Cheerio = require("cheerio");
const fs = require("fs");
const contentService = require("./contentService");

const crawler = new Crawler({
  maxConnections: 1,
});

function modifyHTML(urls, crawler) {
  return new Promise((resolve, reject) => {
    const loop = urls.map((url) => {
      return new Promise((resolve, reject) => {
        crawler.queue([
          {
            uri: url,
            callback: async (error, res, done) => {
              if (error) {
                console.log(error);
              } else {
                const newDoc = res.body;
                const $ = Cheerio.load(newDoc);

                //replace the old link with VNLink
                $("a").each((index, element) => {
                  const href = $(element).attr("href");
                  if (
                    href &&
                    href.startsWith("https://www.avision.com") &&
                    !href.endsWith("png")
                  ) {
                    $(element).attr(
                      "href",
                      href.replace(
                        "https://www.avision.com/en",
                        "http://localhost:3000"
                      )
                      // "http://localhost:3000/"
                    );
                  }
                });

                //replace old text with translate text
                var doc = $(".elementor-widget-container");
                for (let index = 0; index < doc.length; index++) {
                  let element = doc.eq(index);
                  let content = element.text().trim();

                  if (content) {
                    if (element.children(":not(br)").length == 0) {
                      let newText = await contentService.findTranslatedWord(
                        element.text().replace(/\s+/g, " ")
                      );
                      element.text(newText);
                    } else {
                      const children = element.find("*");
                      for (let index = 0; index < children.length; index++) {
                        let childNode = children.eq(index);
                        let node = $(childNode);
                        if (
                          node.children(":not(br)").length == 0 &&
                          node.text().trim()
                        ) {
                          let newText = await contentService.findTranslatedWord(
                            node.text().replace(/\s+/g, " ")
                          );
                          node.text(newText);
                        }
                      }
                    }
                  }
                }

                //remove popmade
                $("#popmake-2659").remove();
                $("#popmake-11307").remove();

                // Save the modified HTML to a file
                const modifiedHtml = $.html();

                fs.writeFileSync(
                  url
                    .toString()
                    .replace(
                      "https://www.avision.com/en",
                      "http://localhost:3000"
                    )
                    .replaceAll(":", "_")
                    .replaceAll("/", "H"),
                  modifiedHtml
                );

                // Open the file in the default web browser
                // const { exec } = require("child_process");
                // exec("start modified.html");
                resolve(modifiedHtml);
              }
              done();
            },
          },
        ]);
      });
    });
    crawler.once("error", (error) => reject(error));
    crawler.once("drain", () => {
      Promise.all(loop).then((results) => {
        resolve(results);
      });
    });
  });
}

module.exports = {
  async getTranslatePage(url) {
    let html = await modifyHTML([url], crawler);
    return html;
  },
  async saveHtmlLocal(html, path) {
    path = "local/" + fs.writeFileSync(path, html);
  },

  getLocalPath(path) {
    let localPath = path
      .toString()
      .slice(27)
      .replaceAll("/", "_")
      .replaceAll("-", "_");
    return localPath;
  },
};
