exports.ensureAuthenticated = (req, resp, next) => {

      if(req.isAuthenticated()) {
          return next();
      }

      req.flash('error_msg', 'Please Log in to View this ressource');
      resp.redirect('/users/login');
  };
//
// exports.checkUserAuth = (req, resp ,next) => {
//     if ( req.isAuthenticated() && req.session.passport.user !== 12 ) {
//         return next()
//     }
//     req.flash('error_msg', 'Please Log in to View this ressource');
//     resp.redirect('/users/login');
// };


