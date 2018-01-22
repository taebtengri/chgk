var authController = require('../controllers/auth_controller.js');
var connection = require('../server.js')
var reCAPTCHA=require('recaptcha2')
 
recaptcha=new reCAPTCHA({
  siteKey:'6LceqEEUAAAAAE3yURYuIsFpFH0DGdgFE8sMPCnA',
  secretKey:'6LceqEEUAAAAAAbw8sQRFB0Xe-_WqP8cdd1eIHca'
})


module.exports = function(app, passport, sequelize) {


  app.get('/signup', authController.signup);


  app.get('/login', authController.login);

  app.get('/addplayer', isLoggedIn, isAdmin, authController.addplayer);

  app.get('/rules', isLoggedIn, authController.rules);

  app.get('/admin', isLoggedIn, isAdmin, authController.admin);

  app.get('/playerrating', isLoggedIn, authController.playerrating);

  app.get('/change', isLoggedIn, authController.change);

  app.get('/userrating', isLoggedIn, authController.userrating);

   app.get('/team', isLoggedIn, authController.team);

  app.get('/myteam', isLoggedIn, authController.myteam);


  app.post('/register', submitForm, passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup',
    }

  ));

  app.get('/signout', authController.signout);


  app.post('/login', passport.authenticate('local-signin', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureMessage: "Неверный пароль или логин",
      
    }

  ));


app.get('/', isLoggedIn, authController.index);

  function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())

      return next();

    res.redirect('/login');

  }

  function isAdmin(req, res, next) {
              console.log(req.user + "AaAaA")
            if (req.user === undefined) {
                // The user is not logged in
                res.redirect('/');
            } else if (req.user.username === "admin") {
                return next();
            }
            else {
              res.redirect('/');
            }
  }

  function submitForm(req,res, next){
  recaptcha.validateRequest(req)
  .then(function(){
    // validated and secure
    return next();
  })
  .catch(function(errorCodes){
    res.redirect('/signup');
    // invalid
    //res.json({formSubmit:false,errors:recaptcha.translateErrors(errorCodes)});// translate error codes to human readable text
  });
}


///////////////////////////////////////////////////////////////////////////////////////////
// API routes
///////////////////////////////////////////////////////////////////////////////////////////
app.post("/api/addplayer", isAdmin, function(req, res) {

  var parameters = [
    [req.body.name, req.body.captain, req.body.team]
  ];;
  console.log(parameters)

  connection.query("INSERT INTO players (name, captain, team) VALUES ?", [parameters],
 function(err, data) {
  console.log("updated")
});

  return res.json(parameters);

});
////////////////////////////////////////////////////////////////////////////////////////
app.get('/api/user_data', function(req, res) {

            if (req.user === undefined) {
                // The user is not logged in
                res.json({});
            } else {
                res.json({
                    username: req.user
                });
            }
        });

///////////////////////////////////////////////////////////////////////////////////////////////

app.get("/api/myteam", function(req, res) {
  var parameters = req.user.id;
  console.log(parameters);
  var players = "( ";
    connection.query("SELECT * FROM userteams WHERE userid = ? ORDER BY isCaptain ASC, player ASC", parameters
, function(err, data) {
  console.log(data.length + " l")
  for (i=0; i < data.length; i++) {
    players += data[i].player.toString() + ", ";
  };
  
  players = players.slice(0, players.length - 2);
  players += ")"
  console.log(players);
    connection.query("SELECT * FROM players WHERE id in " + players, function(err, data1){
      console.log("myteam " + data1)
      var p = data1
      if (p == undefined) {
        p = [0]
      }
      console.log("myteam " + p)
      return res.json(p);
    })

});
});

app.get("/api/team/:id", function(req, res) {
  var parameters = req.params.id;
  console.log(parameters);
  var players = "( ";
    connection.query("SELECT * FROM userteams WHERE userid = ? ORDER BY isCaptain ASC, player ASC", parameters
, function(err, data) {
  console.log(data.length + " l")
  for (i=0; i < data.length; i++) {
    players += data[i].player.toString() + ", ";
  };
  
  players = players.slice(0, players.length - 2);
  players += ")"
  console.log(players);
    connection.query("SELECT * FROM players WHERE id in " + players, function(err, data1){
      console.log(data1)
      return res.json(data1);
    })

});
});

app.get("/api/user_search/:id", function(req, res) {
   var parameters = req.params.id;
  console.log(parameters);
  connection.query("SELECT * FROM users WHERE id = ?", parameters
, function(err, data) {
  return res.json(data);
})

})

app.get("/api/leadermain", function(req, res) {
  var parameters = req.user.id;
  console.log(parameters);
  var players ;
    connection.query("SELECT * FROM userteams WHERE userid = ? ORDER BY isCaptain ASC, player ASC", parameters
, function(err, data) {
  console.log(data);
  return res.json(data);
});
});

app.post("/api/saveteam", isLoggedIn, function(req, res) {

  var parameters = req.body;
  console.log(parameters)

   connection.query("DELETE FROM userteams WHERE userid = ?", parameters.userid,
  function(err, data) {
   console.log("updated")
   console.log("Number of records deleted: " + res.affectedRows);
   
 });

   connection.query("UPDATE users SET money = ? WHERE id = ?", [parameters.money, parameters.userid],
  function(err, data) {
   console.log("updated money")  
 });

var insertion = "INSERT INTO userteams (userid, player, isMain, isLeader) VALUES ?";


var values = [];

for(i=0; i < parameters.selected.length; i++) {
  var arr = [];
  arr.push(parameters.userid);
  arr.push(parameters.selected[i])
  if (parameters.main.indexOf(parameters.selected[i]) !== -1) {
    arr.push(1)
  }
  else {
    arr.push(0)
  }

  if (parameters.leader == parameters.selected[i]) {
    arr.push(1)
  }
  else {
    arr.push(0)
  }

  values.push(arr);

}

connection.query(insertion, [values], function(err) {
    if (err) throw err;
      console.log("done")
      return res.json(parameters);
});



});

}
