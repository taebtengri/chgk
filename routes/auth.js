var authController = require('../controllers/auth_controller.js');
var connection = require('../server.js')


module.exports = function(app, passport, sequelize) {


  app.get('/signup', authController.signup);


  app.get('/login', authController.login);

  app.get('/addplayer', isLoggedIn, isAdmin, authController.addplayer);

  app.get('/rules', isLoggedIn, authController.rules);

  app.get('/admin', isLoggedIn, isAdmin, authController.admin);

  app.get('/playerrating', isLoggedIn, authController.playerrating);


  app.post('/register', passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/register',
    }

  ));

  app.get('/signout', authController.signout);


  app.post('/login', passport.authenticate('local-signin', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureMessage: "Неверный пароль или логин",
      
    }

  ));

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


///////////////////////////////////////////////////////////////////////////////////////////////
}
