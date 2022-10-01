const express = require("express");
const app = express();

const home = require("./home");
const games = require("./games");
const login = require("./login");
const register = require("./register");
const admin = require("./admin");
const adminUser = require("./admin-user");

app.use(home);
app.use(games);
app.use(login);
app.use(register);
app.use(admin);
app.use(adminUser);

module.exports = app;
