const connectDB = require("./src/database.js");
const linkService = require("./src/services/linkService.js");
const contentService = require("./src/services/contentService.js");
const pageService = require("./src/services/pageService.js");
const gloosaryService = require("./src/services/glossaryService.js");
const transAPI = require("./src/services/transAPI.js");
const fs = require("fs");
require("dotenv").config();

(async () => {
  try {
    // Step 1: Connect to the database
    await connectDB();
    // //console.log("Connected to the database");

    // await contentService.checkAll();
    // console.log("All check done");

    //Step 2: Crawling the URLs
    //await linkService.crawAllUrl();
    console.log("URL crawling completed successfully");

    let links = await linkService.getLinksNeedToCrawl();

    //Step 2.5 => Save all link html to onlinePage
    // await linkService.saveAllUrl(links);
    // console.log("Save all url to html done");

    // //Step 3: Crawling all the pages English word in to db
    // // const links = [
    // //   //"https://www.avision.com/en/shop/mobile-scanner/scanq-sw/",
    // //   //process.env.ORIGIN_URL,
    // //   "https://www.avision.com/en/shop/medical/capsocam-plus/",
    // // ];

    // // console.log(links);
    // let mess = await contentService.crawlingAllPage(links);
    // console.log("Crawling all words");

    // // //Step 4: Translate all words in db in to Vietnamese
    // await contentService.translateDb();
    // console.log("Translate all words to vn done");

    //Step 5: Translat all page and save them to local
    // let db = await contentService.getContentArray();
    // console.log(db);
    let result = await pageService.translateAllPage(links);
    //console.log(result);

    //step 7: create Agency page;
    await pageService.createAgencyPage();
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Error initializing application:", error);
  }
})();

// Step 6 fixing wrong content by a gloosary
// (async () => {
//   await connectDB();
//   let name =
//     //"https://www.avision.com/en/shop/document-scanner/ad120-series/ad120s/";
//     process.env.ORIGIN_URL;
//   await gloosaryService.replaceOnePage(name);
//   console.log("Tesing Done");
// })();

// module.exports = {
//   CrawFunction: async () => {
//     try {
//       // Step 1: Connect to the database
//       await connectDB();
//       // //console.log("Connected to the database");

//       // await contentService.checkAll();
//       // console.log("All check done");

//       //Step 2: Crawling the URLs
//       await linkService.crawAllUrl();
//       console.log("URL crawling completed successfully");

//       let links = await linkService.getLinksNeedToCrawl();

//       //Step 2.5 => Save all link html to onlinePage
//       await linkService.saveAllUrl(links);
//       console.log("Save all url to html done");

//       //Step 3: Crawling all the pages English word in to db
//       // const links = [
//       //   //"https://www.avision.com/en/shop/mobile-scanner/scanq-sw/",
//       //   //process.env.ORIGIN_URL,
//       //   "https://www.avision.com/en/shop/medical/capsocam-plus/",
//       // ];

//       // console.log(links);
//       let mess = await contentService.crawlingAllPage(links);
//       console.log("Crawling all words");

//       // //Step 4: Translate all words in db in to Vietnamese
//       await contentService.translateDb();
//       console.log("Translate all words to vn done");

//       //Step 5: Translat all page and save them to local
//       // let db = await contentService.getContentArray();
//       // console.log(db);
//       let result = await pageService.translateAllPage(links);
//       //console.log(result);
//       console.log("Application initialized successfully");
//     } catch (error) {
//       console.error("Error initializing application:", error);
//     }
//   },
// };
