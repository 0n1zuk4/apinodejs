var express = require('express');
var router = express.Router();

/* GET para pagina inicial. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET para  mostrar todos os clientes. */
router.get('/customers', function (req, res, next) {
    var db = require('../db');
    var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
    Customer.find({}).lean().exec(function(e,docs){
        res.render('userlist', { "userlist": docs });
    });
});

/* GET para buscar um cliente. */
router.get('/search', function(req, res) {
res.render('search', { title: 'Procure um cliente' });
});

/* POST para buscar um cliente. */
router.post('/search', function (req, res) {
    var db = require('../db');
    var customerNome = req.body.nome

    var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
    Customer.find({ name: customerNome }).lean().exec(function (e, docs) {
        res.json(docs);
        res.end();
    });
});


/* GET para add um novo cliente. */
router.get('/newuser', function(req, res) {
res.render('newuser', { title: 'Add New User' });
});


/* POST para um novo cliente. */
router.post('/newuser', function (req, res) {
    var db = require('../db');
    var customerName = req.body.name;
    var customerEmail = req.body.email;

    var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
    var newcustomer = new Customer({ name: customerName, email: customerEmail });
    newcustomer.save(function (err) {
        if (err) {
            return err;
        }
        console.log("Post saved");
            res.redirect("customers");
    });
});


router.get('/edit/:id',function(req, res) {
var db = require('../db');
var id  = req.params.id;

var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
Customer.find({_id: id }, function (err, docs) {
      if (err){
        return err;
      }
      res.render('edit', { 'userlist' : docs});

  });
});


router.post('/edit/:id',function(req, res,next){
    var db = require('../db');
    var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
    Customer.findOneAndUpdate({_id : req.params.id}, req.body, {upsert : true}, function(err, doc){
      if (err){
        return err;
      }
      console.log('usuario atualizado no BD');
      res.redirect('/customers');
    });
});








/* POST para deleter um cliente */

router.get('/delete/:id', function(req, res){
    var db = require('../db');

    var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
    Customer.findById({ _id: req.params.id}).remove(function(err){
        if (err){
          return err;
        }
        res.redirect("/customers");
    });
});

module.exports = router;
