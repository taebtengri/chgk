var authController = require('../controllers/auth_controller.js');


module.exports = function(app, passport, sequelize) {


  app.get('/signup', authController.signup);


  app.get('/login', authController.login);

  app.get('/addplayer', isLoggedIn, authController.addplayer);

  app.get('/rules', isLoggedIn, authController.rules);

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

app.get('/', isLoggedIn, authController.index);

  function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())

      return next();

    res.redirect('/login');

  }

}
