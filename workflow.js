const connectDB = require("./src/database.js");
const linkService = require("./src/services/linkService.js");
const contentService = require("./src/services/contentService.js");
const pageService = require("./src/services/pageService.js");
const transAPI = require("./src/services/transAPI.js");
const fs = require("fs");
require("dotenv").config();

// (async () => {
//   let word = await transAPI.translateGoogle("Hello how are you");
//   console.log(typeof word);
//   console.log(word);
// })();

// function delay(milliseconds) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, milliseconds);
//   });
// }

(async () => {
  try {
    // Step 1: Connect to the database
    await connectDB();
    // //console.log("Connected to the database");

    // await contentService.checkAll();
    // console.log("All check done");

    //Step 2: Crawling the URLs
    // await linkService.crawAllUrl();
    // //await delay(5000);
    console.log("URL crawling completed successfully");

    // //Step 3: Crawling all the pages English word in to db
    // const links = [
    //   //"https://www.avision.com/en/shop/mobile-scanner/scanq-sw/",
    //   process.env.ORIGIN_URL,
    // ];
    let links = await linkService.getLinksNeedToCrawl();
    console.log(links);
    let mess = await contentService.crawlingAllPage(links);
    console.log("Crawling all words");

    // //TRanslate a html file
    // let fileHtml = await transAPI.translateHtmlGoogle("fileHtml.html");
    // fs.writeFileSync("fileHtmlDemo.html", fileHtml);
    // console.log("write html done");

    //Step 4: Translate all words in db in to Vietnamese
    await contentService.translateDb();
    console.log("Translate all words to vn done");

    //Step 5: Translat all page and save them to local
    let result = await pageService.translateAllPage(links);
    console.log(result);
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Error initializing application:", error);
  }
})();

//Step 4: Translate all words in db in to Vietnamese
// (async () => {
//   await contentService.translateDb();
// })();

// (async () => {
//   await connectDB();
//   //Step 5: Demo: go to a link and replace it with Vietnamese and give it back to fe
//   pageService.getTranslatePage(process.env.ORIGIN_URL);
// })();

//CHECK ALL THE translate word:

// //Demo a page
// (async () => {
//   try {
//     // Step 1: Connect to the database
//     await connectDB();

//     // //Step 3: Crawling all the pages English word in to db
//     const links = [process.env.ORIGIN_URL];
//     let mess = await contentService.crawlingAllPage(links);
//     console.log("Crawling all words");

//     //Step 4: Translate all words in db in to Vietnamese
//     // await contentService.translateDb();
//     // console.log("Translate all words to vn done");

//     //Step 5: Translat all page and save them to local
//     let result = await pageService.translateAllPage(links);
//     console.log(result);
//     console.log("Application initialized successfully");
//   } catch (error) {
//     console.error("Error initializing application:", error);
//   }
// })();
