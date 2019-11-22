let express = require('express');
let router = express.Router();
const models = require( '../models/index');
const multer  = require('multer');
const path = require('path');
const Sequelize = require('sequelize');
const ensureAuthenticated = require('../core/auth');
const Op = Sequelize.Op;
const storage = multer.diskStorage({
   destination: './public/uploads',
   filename: (req,file,cb)=>{
    cb(null, file.originalname + path.extname(file.originalname))
   }
});
let upload = multer({
    storage : storage
}).single('image');


/* GET ADMIN HOME page. */
router.get('/admin',ensureAuthenticated.ensureAuthenticated,function(req, resp, next) {

    if(req.session.passport.user !== 12){
        req.flash('success_msg', `Welcome dear !`);
        resp.redirect('/')
    } else {
        const first = models.book.findAll();
        const second =sequelize.query('SELECT quantity, book_name FROM books where books.quantity < 10',
                         {type: sequelize.QueryTypes.SELECT });

        Promise.all([first,second])
            .then(responses=> {
                const books = responses[0];
                const qtBooks = responses[1];
                const errorQt = true;

                //@second exist
                if (responses[1] === [] ){

                    resp.render('admin/admin',{books :books, qtBooks: qtBooks, errorQt});
                } else {
                    resp.render('admin/admin',{books : books });

                }
            })
            .catch((err)=>{
                throw err
            })


    }

});


/* GET ADMIN EDIT page. */
router.get('/admin/edit/:id',ensureAuthenticated.ensureAuthenticated,function(req, resp, next) {
    //
    const first = models.type.findAll({attributes: ['id','type_name'] });

   const second = sequelize.query('SELECT books.id,books.quantity,books.book_name,books.price,books.description,books.path_image FROM books INNER JOIN types ON books.id_type = types.id where books.id = ?',
            { replacements: [`${req.params.id}`], type: sequelize.QueryTypes.SELECT });

   Promise.all([first,second])
       .then(responses=>{
           resp.render('admin/adminEdit',{Types :responses[0], books: responses[1] });
       })
       .catch((err)=>{
           throw err
       })

});


/* UPDATE BOOKS  page. */
router.put('/admin/edit/:id',function(req, resp, next) {

    upload(req,resp,(err)=>{

        if (err) {
            throw err;
            resp.render('admin/adminEdit')
        } else  {

            models.book.update(
                    {
                    book_name:req.body.libelle,
                    quantity: req.body.quantite_book,
                    price: req.body.prix,
                    is_reserved: 0,
                    description: req.body.description,
                    path_image: req.file.path,
                    id_type: req.body.book_type
                    },
                    { where :
                            {id :req.params.id}
                    }
                ).then( (results)=> {
                    req.flash('success_msg','You have successfully Modify the selected book');
                    resp.redirect('/admin')
                }).catch( (err)=>{
                    throw err
            })
        }
    })
});


/* GET ADMIN ADD BOOKS FORM page. */
router.get('/admin/books/add',ensureAuthenticated.ensureAuthenticated,(req,resp, next)=>{

    models.type.findAll({
        attributes: ['type_name','id']
    }).then((results)=>{
            resp.render('admin/adminAdd',{types : results });
        }).catch( (err)=>{
            throw err;
        });
});

/* DELETE BOOKS page. */
router.post('/admin/delete/:id', function (req, resp, next) {

    models.book.destroy(
        { where: {id : req.params.id} } )
        .then(()=>{
        req.flash('success_msg', 'The Book has been successfully deleted !');
        resp.redirect('/admin')
        })
        .catch((err)=>{
            throw err;
        })
});


/* POST ADD BOOKS page. */
router.post('/admin/books/add',upload,function(req, resp, next) {

    const {book_type, quantite_book, libelle, prix,description} = req.body;

    upload(req,resp,(err)=>{

            if (err) {
                throw err;
                resp.render('admin/adminadd')
            } else{
                models.book.create({
                    book_name:libelle,
                    quantity: quantite_book,
                    price: prix,
                    is_reserved: 0,
                    description: description,
                    path_image: req.file.path,
                    id_type: book_type
                }).then( (results)=> {
                    req.flash('success_msg','You have successfully add a new book');
                    resp.redirect('/admin')
                }).catch( (err)=>{
                    throw err
                })
            }
        })
    });

module.exports = router;
