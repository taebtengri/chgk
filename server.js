var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");
var express = require("express");
var passport = require('passport');
var session = require('express-session');
var env = require('dotenv').load();
var models = require("./models");
var mysql = require("mysql");

require('./config/passport/passport.js')(passport, models.user);

var connection = mysql.createConnection({
  host: "a07yd3a6okcidwap.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  port: 3306,

  // Your username
  user: "txlf37jpmrxdpgpb",

  // Your password
  password: "yuars8cd1h39jw0k",
  database: "cxsl9gryw3jcio1f"
});

module.exports = connection;

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

models.sequelize.sync().then(function() {

    console.log('connected to user database');

}).catch(function(err) {

    console.log(err, "database ERROR!");

});


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use('/public', express.static('public'));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session());
var authRoute = require('./routes/auth.js')(app, passport);




app.get("/", function(req, res) {

  res.sendFile(path.join(__dirname, "/public/index.html"));

});



app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});



app.get("/getteams", function(req, res) {
  var teams;
  connection.query("SELECT * FROM teams", {
}, function(err, data) {
  teams = data;
  return res.json(teams);
});

});

app.get("/api/ratingp", function(req, res) {
  var players;
  connection.query("SELECT * FROM players ORDER BY score DESC, team ASC", {
}, function(err, data) {
  players = data;
  return res.json(players);
});

});



