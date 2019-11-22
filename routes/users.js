var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const models = require( '../models/index');
const ensureAuthenticate = require('../core/auth');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


/* GET users Login page. */
router.get('/users/login', function(req, res, next) {

    res.render('authentication/usersLogin');
});


/* GET users Register page. */
router.get('/users/register', function (req,resp,next) {

    resp.render('authentication/usersRegister');

});

/* POST RESERVED BOOKS users. */
router.put('/users/reserved/:id',ensureAuthenticate.ensureAuthenticated, function (req,resp,next) {

    if(req.session.passport.user !== 12) {

        sequelize.query('UPDATE books SET is_reserved =true AND quantity= quantity-1 where books.id = ?', {replacements: [req.params.id] })
            .then(() =>
            {
                req.flash('success_msg', 'Book reserved successfully ');
                resp.redirect('/');
            })
            .catch((err) => {
                throw err;
            })
    }
    else {
        resp.send('You are not a simple user to reserves books')
    }


});


/* POST LOGOUT users. */
router.get('/users/logout', function (req,resp,next) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    resp.redirect('/users/login');
});



/* POST login users. */
router.post('/users/login',(req,resp,next)=> {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, resp, next);
});


/* POST Register users. */
router.post('/users/register',function (req,resp,next) {

    const {firstName, lastName, email, password} = req.body;
    let errors = [];

    if (!firstName || !lastName || !email || !password) {
        errors.push({msg: 'Please enter all fields'});
    }
    if (password.length < 6) {
        errors.push({msg : 'Password should be at least 6 characters'})
    }
    if (errors.length > 0) {
        resp.render('authentication/usersRegister',
            {
                errors,
                lastName,
                firstName,
                email,
                password
            });
    } else {
        //Validation Passed

        models.User.findAll({
            attributes: ['email'],
            where : { email: req.body.email }
        }).then(result => {
            if (result === true) {
                errors.push({msg: 'Email already exists'});
                resp.render('authentication/usersRegister', {
                    errors,
                    firstName,
                    lastName,
                    password,
                });
            } else {
                bcrypt.hash(password, 10).then(function(hash) {
                    models.User.create( {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: hash,
                        id_profil:1
                    }).then(() => {
                        req.flash('success_msg','You are now registered and can log in ');
                        resp.redirect('/users/login')
                    }).catch((err) => {
                        throw err;
                    })

                });
            }
        });
    }
});

module.exports = router;
