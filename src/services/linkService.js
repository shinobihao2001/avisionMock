const linkModel = require("../models/link");
const Crawler = require("crawler");
require("dotenv").config();

//save in to db
const createLink = async (link) => {
  try {
    await linkModel.create({
      value: link,
      vnLink: link.replace("/en", "/vn"),
      isCrawlNeed: link.includes("/en"),
    });
  } catch (error) {
    console.log(error);
  }
};
const crawler = new Crawler({
  maxConnections: 1,
});

function getPageAsync(urls, crawler) {
  return new Promise((resolve, reject) => {
    const loop = urls.map((url) => {
      return new Promise((resolve, reject) => {
        crawler.queue([
          {
            uri: url,
            callback: async (error, res, done) => {
              console.log("Calling callback");
              if (error) {
                console.log(error);
                reject(error);
              } else {
                const $ = res.$;
                const uniqueLinks = new Set();

                // Find all anchor tags and get their href attributes
                $("a").each((index, element) => {
                  const href = $(element).attr("href");
                  if (
                    href &&
                    href.startsWith("https://www.avision.com") &&
                    !href.endsWith("png")
                  ) {
                    uniqueLinks.add(href);
                  }
                });

                // Convert the Set to an array
                let links = Array.from(uniqueLinks);

                // Print the links
                console.log("Links:", links);

                //save in to db
                for (let link of links) {
                  await createLink(link);
                }
              }
              resolve("Crawl Done");
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

async function getAllUrl() {
  var links = await linkModel.find();
  return links;
}
module.exports = {
  //Crawling all the links
  crawAllUrl: async () => {
    console.log("Start crawling all links");
    let result = await getPageAsync([process.env.ORIGIN_URL], crawler);
    console.log(result);
    console.log("Finish crawling all links");
  },

  //Get the link that need to crawl
  getLinksNeedToCrawl: async () => {
    let linkArray = new Array();
    const allLink = await getAllUrl();
    for (const link of allLink) {
      if (link.isCrawlNeed) {
        linkArray.push(link.value);
      }
    }
    return linkArray;
  },
};
