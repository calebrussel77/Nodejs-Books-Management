exports.ensureAuthenticated = (req, resp, next) => {

      if(req.isAuthenticated()) {
          return next();
      }

      req.flash('error_msg', 'Please Log in to View this ressource');
      resp.redirect('/users/login');
  };

exports.isNotAuth = (req, resp ,next) => {
    if ( req.isUnauthenticated() ) {
        return next();
    }
};


