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

  app.get('/userrating', isLoggedIn, authController.userrating);


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
}
