var express = require('express');
var router = express.Router();
const models = require( '../models/index');
const ensureAuthenticate = require('../core/auth');
const passport = require('passport');
let moment = require('moment');

/* GET home page. */
router.get('/', function(req, resp, next) {

    if (!req.isAuthenticated()) {
        console.log('salut User Non Authentifier');
        sequelize.query('SELECT books.id_type,books.price,books.book_name,books.path_image,books.updatedAt,books.id,books.description,types.type_name FROM books,types where books.id_type = types.id AND books.is_reserved = false',
            {type: sequelize.QueryTypes.SELECT })
            .then( (results)=>{
                resp.render('home', {results : results, date: moment })
            }).catch((err)=>{
            throw err;
        })

    }
    else if (req.isAuthenticated()===true && req.session.passport.user !== 12) {
        console.log('salut simpleUser');
        sequelize.query('SELECT books.id_type,books.price,books.book_name,books.path_image,books.updatedAt,books.id,books.description,types.type_name FROM books,types where books.id_type = types.id AND books.is_reserved = false',
            {type: sequelize.QueryTypes.SELECT })
            .then( (results)=>{
                resp.render('home', {results : results, date: moment,simpleUser: true})
            }).catch((err)=>{
            throw err;
        })
    }
    else if (req.isAuthenticated()=== true && req.session.passport.user === 12) {
        sequelize.query('SELECT books.id_type,books.price,books.book_name,books.path_image,books.updatedAt,books.id,books.description,types.type_name FROM books,types where books.id_type = types.id AND books.is_reserved = false',
            {type: sequelize.QueryTypes.SELECT })
            .then( (results)=>{
                resp.render('home', {results : results, date: moment,admin :true})
            }).catch((err)=>{
            throw err;
        });
        console.log('salut Admin');

    }

});
module.exports = router;
