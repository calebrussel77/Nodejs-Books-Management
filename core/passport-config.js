const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const models = require('../models/index');


module.exports = function (passport) {
  passport.use(
      new LocalStrategy({ usernameField : 'email'}, (email,password,done) => {

          //Match User.Email
          models.User.findOne({
              attributes: ['email','password','id'],
              where : { email: email}})
              .then( (user) =>{
                  if (user === null || user === undefined) {
                      return done(null,false,{message: 'This email is not registered '} )
                  }
                  //Match Password
                  bcrypt.compare(password, user.password, (err, isMatch) =>{
                      if (err) throw err;
                      if (isMatch === true) {
                          return done(null,user)
                      } else {
                          return done(null, false, {message: 'Password incorrect'})
                      }
                  });
              }).catch((err)=>{
                  throw err;
          })
      })
  );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        models.User.findOne({
            attributes: ['lastName','email','firstName','id'],
            where : {
                id : id
            }
        }).then( (user,reject) => {
            done(reject,user)
        });
    });

};

// exports.authenticationMiddleware = () => {
//     return (req,res,next) => {
//         console.log(`
//       req.session.passport.user: ${JSON.stringify(req.session.passport)};
//       `);
//         if(req.isAuthenticated()) {
//             return next();
//         }
//         res.redirect('/users/login');
//     }
// };

