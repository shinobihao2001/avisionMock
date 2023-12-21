const gloosaryService = require("./src/services/glossaryService");
const userService = require("./src/services/userService");
const connectDB = require("./src/database");
const ob = require("./config.json");
//gloosaryService.getGlossaryCsv();
(async () => {
  let res = gloosaryService.getProductGlossaryCsv();
  console.log(res);
})();
