const express = require("express");
const app = express.Router();
const {
  user_game,
  user_game_biodata,
  user_game_history,
} = require("../models");
const bcrypt = require("bcrypt");

// READ
app.get("/admin", (req, res) => {
  const msg = req.query.msg;

  if (req.query.user == "admin") {
    user_game.findAll({
      order: [["id", "ASC"]],
    }).then((user) =>
      res.status(200).render("admin", {
        title: "Admin Page",
        user,
        msg: msg,
      })
    );
  } else if (req.query.user != "admin") {
    res.redirect("/admin-user");
  }
});

// CREATE
app.post("/admin/add", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userData = {
    username: req.body.username,
    password: hashedPassword,
  };

  user_game.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) =>
      !user
        ? user_game.create(userData)
            .then((user_game) => {
              user_game_biodata.create({
                user_id: user_game.get("id"),
              });
              user_game_history.create({
                user_id: user_game.get("id"),
              });
              res.status(201).redirect("/admin?user=admin&msg=created");
            })
            .catch((err) => {
              res.status(422).send("Cannot create user:", err);
            })
        : res.redirect("/admin?user=admin&msg=exist")
    )
    .catch((err) => res.send("ERROR: " + err));
});

// UPDATE
app.post("/admin/edit/:id", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    username: username,
    password: hashedPassword,
  };

  const updateData = async (data) =>
    await user_game.update(data, { where: { id: req.params.id } })
      .then(() => {
        res.status(201).redirect("/admin?user=admin&msg=updated");
      })
      .catch((err) => res.status(422).send("Cannot update user: ", err));

  const findUsername = async (username) =>
    await user_game.findOne({
      where: {
        username: username,
      },
    });

  user_game.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((id) => {
      if (username != "" && password != "") {
        findUsername(username).then((dbUser) => {
          !dbUser
            ? updateData(userData)
            : res.redirect("/admin?user=admin&msg=error");
        });
      } else if (username != "" && password == "") {
        findUsername(username).then((dbUser) => {
          !dbUser
            ? updateData({ username: username })
            : res.redirect("/admin?user=admin&msg=error");
        });
      } else if (username == "" && password != "") {
        updateData({ password: hashedPassword });
      }
    })
    .catch((err) => res.send("ERROR: " + err));
});

// DELETE
app.post("/admin/delete/:id", (req, res) =>
  user_game.destroy({ where: { id: req.params.id } })
    .then(() => res.status(201).redirect("/admin?user=admin&msg=deleted"))
    .catch(() => res.status(422).send("Cannot delete the games id"))
);

// HANDLE REDIRECTION READ if any access this page
app.get("/admin/*", (req, res) =>
  user_game.findAll().then(() =>
    res.status(200).redirect("/admin?user=admin")
  )
);

module.exports = app;
