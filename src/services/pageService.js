const Crawler = require("crawler");
const Cheerio = require("cheerio");
const fs = require("fs");
const contentService = require("./contentService");

function modifyHTML(url) {
  return new Promise((resolve, reject) => {
    const crawler = new Crawler({
      maxConnections: 1,
      rateLimit: 2000,
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
              $(element).attr("href", href.replace("com/en", "/vn"));
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
          fs.writeFileSync("modified.html", modifiedHtml);

          // Open the file in the default web browser
          const { exec } = require("child_process");
          exec("start modified.html");
          resolve(modifiedHtml);
        }
        done();
      },
    });

    // Queue the URL
    crawler.queue(url);
  });
}

module.exports = {
  getTranslatePage(url) {
    modifyHTML(url)
      .then((html) => {
        return html;
      })
      .catch((error) => console.log(error));
  },
};
