var exports = module.exports = {}
var path = require("path");
var sequelize = require("sequelize");

exports.signup = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/signup.html"));

}

exports.login = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/login.html"))

}

exports.myteam = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/myteam.html"))

}

exports.admin = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/admin.html"))

}

exports.signout = function(req, res) {

    req.session.destroy(function(err) {

res.sendFile(path.join(__dirname, "../public/login.html"));

});

}

exports.index = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/main.html"));

}

exports.team = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/team.html"));

}

exports.change = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/sostav.html"));

}

exports.playerrating = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/ratingp.html"));

}

exports.userrating = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/ratingu.html"));

}

exports.rules = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/rules.html"));

}

exports.addplayer = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/addplayer.html"));

}

