const workflow = require("./workflow");

workflow.CrawFunction();
// Time to run the craw tool
const timeLapse = 1000 * 60 * 60; // 1 hours
setInterval(async () => {
  try {
    console.log("Application start crawling at", new Date().toDateString());
    await workflow.CrawFunction();
    console.log("Application finish crawling at", new Date().toDateString());
  } catch (error) {
    console.error("Error initializing application:", error);
  }
}, timeLapse);
