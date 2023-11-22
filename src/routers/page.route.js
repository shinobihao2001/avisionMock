const router = require("express").router();

router.get("/", (req, res) => {
  console.log(req.url);
  res.send("Done");
});
