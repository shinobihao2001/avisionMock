const { header } = require("express/lib/request");
const linkModel = require("../models/link");
const Crawler = require("crawler");
const ulti = require("./ulti");
const path = require("path");
const fs = require("fs");
const Cheerio = require("cheerio");
const { exec } = require("child_process");
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
                //const $ = Cheerio.load(res.body);
                const $ = res.$;
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
                const links = Array.from(uniqueLinks);
                resolve(links);
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

async function getAllUrl() {
  var links = await linkModel.find();
  return links;
}

async function dropAllUrl() {
  try {
    let result = await linkModel.deleteMany({}).exec();
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function getLinkArray() {
  try {
    let links = await linkModel.find({}).lean().exec();
    let result = [];
    for (let link of links) {
      result.push({
        value: link.value,
        isVisit: false,
      });
    }
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function saveArrayToDB(linkArray) {
  await linkModel.deleteMany({});
  for (let i = 0; i < linkArray.length; i++) {
    await linkModel.create({
      value: linkArray[i].value,
      isVisit: false,
      vnLink: String(linkArray[i].value).replace("/en", "/vn"),
      isCrawlNeed: String(linkArray[i].value).includes("/en"),
    });
  }
  return "Save links to db successfully";
}

module.exports = {
  //Crawling all the links

  crawAllUrl: async () => {
    //await linkModel.deleteMany({});
    console.log("Start crawling all links");

    let linkArray = await getLinkArray();
    function addToArray(oldArray, addArray) {
      for (let i = 0; i < addArray.length; i++) {
        let flag = true;
        for (let j = 0; j < oldArray.length; j++) {
          if (addArray[i] == oldArray[j].value) {
            flag = false;
            break;
          }
        }
        if (flag) {
          oldArray.push({ value: addArray[i], isVisit: false });
        }
      }
      return oldArray;
    }
    function getNotVisitIndex(linkArray) {
      for (let i = 0; i < linkArray.length; i++) {
        console.log(linkArray[i].isVisit);
        if (
          linkArray[i].isVisit == false &&
          String(linkArray[i].value).includes("/www.avision.com/en")
        ) {
          return i + 1;
        }
      }
      return null;
    }

    let startUrl = null;
    do {
      let result = await getPageAsync(
        [startUrl ? startUrl.value : process.env.ORIGIN_URL],
        crawler
      );
      result = result[0];
      console.log(result.length);
      linkArray = addToArray(linkArray, result);
      console.log(linkArray.length);
      let index = getNotVisitIndex(linkArray);
      console.log(index);
      if (index) {
        index--;
        startUrl = linkArray[index];
        linkArray[index].isVisit = true;
      } else {
        startUrl = null;
      }
      console.log(startUrl);
    } while (startUrl);

    // save back to db
    await saveArrayToDB(linkArray);
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
      if (
        link.includes("https://www.avision.com/en/agent/") ||
        link.includes(
          "https://www.avision.com/en/contact-us/product-registration/"
        )
      ) {
        continue;
      }
      let doc = await getPageToFile([link], crawler);
      let filename = ulti.getLocalName(link);
      let folder = path.join(__dirname, "onlinePage");
      try {
        //console.log(html);
        fs.writeFileSync(path.join(folder, filename), doc[0]);
        // thread sleep do the program won't lag
        setTimeout(() => {
          console.log("Delayed task  0.3s write file executed to resist lag");
        }, 300);
      } catch (error) {
        console.log(error);
      }
      console.log("Saving: " + link + " is done");
    }
  },

  getOriginalPage(link) {
    let filename = ulti.getLocalName(link);
    let folder = path.join(__dirname, "onlinePage");
    try {
      let page = fs.readFileSync(path.join(folder, filename), "utf-8");
      return page;
    } catch (error) {
      console.log(error);
    }
  },
};
