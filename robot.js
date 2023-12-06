const workflow = require("./workflow");

workflow.CrawFunction();
// Time to run the craw tool
const timeLapse = 1000 * 60 * 60; // 1 hours
setInterval(async () => {
  try {
    await workflow.CrawFunction();
    console.log("Application crawling at", new Date());
  } catch (error) {
    console.error("Error initializing application:", error);
  }
}, timeLapse);
