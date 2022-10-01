const express = require("express");
const app = express.Router();
const { user_game, user_game_biodata } = require("../models");

app.get("/admin-user", (req, res) => {
  const msg = req.query.msg;
  const username = req.query.user;
  user_game.findOne({
    where: {
      username: username,
    },
  }).then((result) => {
    result
      ? user_game_biodata.findOne({
          where: {
            user_id: result.get("id"),
          },
        }).then((user) =>
          res.status(200).render("admin-user", {
            title: "Admin User",
            user,
            msg: msg,
            username: username,
          })
        )
      : res.status(200).redirect("/");
  });
});

module.exports = app;
