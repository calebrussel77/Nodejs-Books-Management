var express = require('express');
var router = express.Router();
const models = require( '../models/index');
let moment = require('moment');

/* GET home page. */
router.get('/', function(req, resp, next) {

    sequelize.query('SELECT books.id_type,books.price,books.book_name,books.path_image,books.updatedAt,books.id,books.description,types.type_name FROM books,types where books.id_type = types.id AND books.is_reserved = false',
        {type: sequelize.QueryTypes.SELECT })
        .then( (results)=>{
            resp.render('home', {results : results, date: moment })
        }).catch((err)=>{
     throw err;
 })

});
module.exports = router;
