const gloosaryService = require("./src/services/glossaryService");
const userService = require("./src/services/userService");
const connectDB = require("./src/database");
//gloosaryService.getGlossaryCsv();
(async () => {
  await connectDB();
  let user = await userService.createUser("fakeAccount", "123456");
  console.log(user);
  console.log("DONE");
})();
