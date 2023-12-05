const { header } = require("express/lib/request");
const linkModel = require("../models/link");
const Crawler = require("crawler");
const pageService = require("./pageService.js");
const path = require("path");
const fs = require("fs");
const Cheerio = require("cheerio");
require("dotenv").config();

//save in to db
const createLink = async (link) => {
  let tempLink = await linkModel.findOne({
    value: link,
  });
  if (tempLink) {
    return "Already exist";
  }
  try {
    await linkModel.create({
      value: link,
      isVisit: false,
      vnLink: link.replace("/en", "/vn"),
      isCrawlNeed: link.includes("/en"),
    });
  } catch (error) {
    console.log(error);
  }
  return "Create link succesfully";
};
const crawler = new Crawler({
  maxConnections: 1,
});

function getPageToFile(urls, crawler) {
  return new Promise((resolve, reject) => {
    const loop = urls.map((url) => {
      return new Promise((resolve, reject) => {
        crawler.queue([
          {
            uri: url,
            callback: async (error, res, done) => {
              console.log("Calling callback to return original html ");
              if (error) {
                console.log(error);
                reject(error);
              } else {
                const $ = Cheerio.load(res.body);
                let doc = $.html();
                resolve(doc);
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
                    !href.endsWith("png") &&
                    !href.endsWith("jpg") &&
                    !href.includes("upload") &&
                    !href.includes("?")
                  ) {
                    uniqueLinks.add(href);
                  }
                });

                // Convert the Set to an array
                let links = Array.from(uniqueLinks);

                // Print the links
                //console.log("Links:", links);

                //save link in to db
                for (let link of links) {
                  let mess = await createLink(link);
                  console.log(`${link}: ${mess}`);
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
    let startUrl = null;
    do {
      let result = await getPageAsync(
        [startUrl ? startUrl.value : process.env.ORIGIN_URL],
        crawler
      );
      console.log(result);
      startUrl = await linkModel.findOne({
        isVisit: false,
        value: { $regex: "/www.avision.com/en" },
      });
      if (startUrl) {
        startUrl.isVisit = true;
        await startUrl.save();
      }
    } while (startUrl);
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

  saveAllUrl: async (links) => {
    console.log(links);
    for (let link of links) {
      console.log("Is saving: " + link);
      let doc = await getPageToFile([link], crawler);
      let filename = pageService.getLocalName(link);
      let folder = path.join(__dirname, "onlinePage");
      try {
        //console.log(html);
        fs.writeFileSync(path.join(folder, filename), doc[0]);
      } catch (error) {
        console.log(error);
      }
      console.log("Saving: " + link + " is done");
    }
  },
};
