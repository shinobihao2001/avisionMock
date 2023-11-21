const connectDB = require("./src/database.js");
const linkService = require("./src/services/linkService.js");
const contentService = require("./src/services/contentService.js");
const pageService = require("./src/services/pageService.js");

//step 1: Connect DB
connectDB();

//Step 2: Crawling the URLs
linkService.crawAllUrl();

//Step 3: Crawling all the pages English word in to db
const links = linkService.getLinksNeedToCrawl();
(async (links) => {
  await contentService.crawlingAllPage(links);
})(links);

//Step 4: Translate all words in db in to Vietnamese
(async () => {
  await contentService.translateDb();
})();

//Step 5: Demo: go to a link and replace it with Vietnamese and give it back to fe
pageService.getTranslatePage(url);
