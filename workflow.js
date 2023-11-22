const connectDB = require("./src/database.js");
const linkService = require("./src/services/linkService.js");
const contentService = require("./src/services/contentService.js");
const pageService = require("./src/services/pageService.js");
require("dotenv").config();

// function delay(milliseconds) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, milliseconds);
//   });
// }

async () => {
  try {
    // Step 1: Connect to the database
    await connectDB();
    //console.log("Connected to the database");

    //Step 2: Crawling the URLs
    await linkService.crawAllUrl();
    // //await delay(5000);
    console.log("URL crawling completed successfully");

    // //Step 3: Crawling all the pages English word in to db
    const links = await linkService.getLinksNeedToCrawl();
    await contentService.crawlingAllPage(links);

    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Error initializing application:", error);
  }
};

//Step 4: Translate all words in db in to Vietnamese
// (async () => {
//   await contentService.translateDb();
// })();
(async () => {
  await connectDB();
  //Step 5: Demo: go to a link and replace it with Vietnamese and give it back to fe
  pageService.getTranslatePage(process.env.ORIGIN_URL);
})();
