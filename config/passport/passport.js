//load bcrypt
var bCrypt = require('bcrypt-nodejs');


module.exports = function(passport, user) {


  var User = user;

  var LocalStrategy = require('passport-local').Strategy;

  // deserialize user
  passport.deserializeUser(function(id, done) {

    User.findById(id).then(function(user) {

      if (user) {

        done(null, user.get());

      } else {

        done(user.errors, null);

      }

    });

  });
  //serialize
  passport.serializeUser(function(user, done) {

    done(null, user.id);

  });
  //LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy(

    {

      usernameField: 'username',

      passwordField: 'password',

      passReqToCallback: true 

    },


    function(req, username, password, done) {

      var User = user;

      var isValidPassword = function(userpass, password) {

        return bCrypt.compareSync(password, userpass);

      }

      User.findOne({
        where: {
          username: username
        }
      }).then(function(user) {

        if (!user) {

          return done(null, false, {
            message: 'Username does not exist'
          });

        }

        if (!isValidPassword(user.password, password)) {
          console.log("incorrect password attempt for: " + user.username);
          return done(null, false, {
            message: 'Incorrect password.'
          });

        }


        var userinfo = user.get();
        console.log("signed in as: " + user.username);
        User.findOne({
        where: {
          username: username
        }
        }).then(function(user) {
                
                if (user) {
                  user.updateAttributes({
                    last_login: new Date().toISOString().slice(0, 19).replace('T', ' ')
                  })   
                }
              })
        return done(null, userinfo);


      }).catch(function(err) {

        console.log("Error:", err);

        return done(null, false, {
          message: 'Something went wrong with your Signin'
        });

      });


    }

  ));
  passport.use('local-signup', new LocalStrategy(

    {

      usernameField: 'username',

      passwordField: 'password',

      passReqToCallback: true 

    },



    function(req, username, password, done) {

      var generateHash = function(password) {

        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

      };



      User.findOne({
        where: {
          username: username
        }
      }).then(function(user) {

        if (user)

        {
          return done(null, false, {
            message: 'That username is already taken'
          });

        } else

        {

          var userPassword = generateHash(password);

          var data =

            {
              email: req.body.email,

              username: username,

              password: userPassword,

              firstname: req.body.firstname,

              lastname: req.body.lastname,

              money: 30

            };

          User.create(data).then(function(newUser, created) {

            if (!newUser) {

              return done(null, false);

            }

            if (newUser) {
              console.log("user registered: " + data.username);

              return done(null, newUser);

            }

          });

        }

      });

    }

  ));

}
