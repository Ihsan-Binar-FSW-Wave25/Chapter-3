const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  const name = req.query.name || "Player";
  console.log(name);
  res.render("chapter4", {
    title: "Rock Paper Scissors Games",
    name: name,
  });
});

module.exports = router;