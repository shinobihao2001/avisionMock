const gloosaryService = require("./src/services/glossaryService");
const userService = require("./src/services/userService");
const configModel = require("./src/models/config");
const connectDB = require("./src/database");
const ob = require("./config.json");
//gloosaryService.getGlossaryCsv();
(async () => {
  await connectDB();
  let data = new configModel({ data: ob });
  await data.save();
  console.log("Done");
})();
