var exports = module.exports = {}
var path = require("path");
var sequelize = require("sequelize");

exports.signup = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/signup.html"));

}

exports.login = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/login.html"))

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

exports.playerrating = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/ratingp.html"));

}

exports.rules = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/rules.html"));

}

exports.addplayer = function(req, res) {

    res.sendFile(path.join(__dirname, "../public/addplayer.html"));

}

