const workflow = require("./workflow");
const schedule = require("node-schedule");

const rule = new schedule.RecurrenceRule();
rule.hour = 1;
rule.minute = 5;

//chạy lúc 1h 10p
const job = schedule.scheduleJob(rule, function () {
  console.log("Starting worflow");
  workflow.CrawlFunction();
});
