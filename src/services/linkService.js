const link = require("../models/link");
const linkModel = require("../models/link");
const Crawler = require("crawler");
require("dotenv").config();

const crawler = new Crawler({
  maxConnections: 10,
  callback: async (error, res, done) => {
    if (error) {
      console.log(error);
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
      for (const link of links) {
        await linkModel.create({
          value: link,
          vnLink: link.replace("/en", "/vn"),
          isCrawlNeed: link.includes("/en"),
        });
      }
    }
    done();
  },
});

module.exports = {
  //Crawling all the links
  crawAllUrl: async function () {
    await crawler.queue(process.env.ORIGIN_URL);
  },

  //Get all links in db
  getAllUrl: async function () {
    var links = await linkModel.find({});
    return links;
  },

  //Get the link that need to crawl
  getLinksNeedToCrawl: async () => {
    let linkArray = [];
    const allLink = await geAllUrl();
    for (const link of allLink) {
      if (link.isCrawlNeed) {
        linkArray.push(link.value);
      }
    }
    return linkArray;
  },
};
