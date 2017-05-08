var express = require('express');
var handlebars = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.engine('handlebars', handlebars({
  defaultLayout: 'main'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'handlebars');

var db;

MongoClient.connect('mongodb://dan:dandandan@ds145389.mlab.com:45389/logintest', function(err, database){
  if (err) return console.log(err);

  db = database;
  app.listen(process.env.PORT || 3000);
});

app.get('/actives', function(req, res){
  res.render('actives');
})

app.get('/fall2015', function(req, res){
  res.render('fall2015');
})

app.get('/highzetareport', function(req, res){
  res.render('highzetareport');
})

app.get('/index', function(req, res){
  res.render('index');
})

app.get('/minutes', function(req, res){
  res.render('minutes');
})

app.get('/officers', function(req, res){
  res.render('officers');
})

app.get('/profile', function(req, res){
  res.render('profile');
})

app.get('/brothers', function(req, res) {
  // res.render('brothers');
  db.collection("brothers").find({}).toArray(function(err, results){
    res.render('brothers', {brothers: results});
  });
});

app.get('/brother', function(req, res) {
  // res.render('brothers');
  db.collection("brothers").find({}).toArray(function(err, results){
    res.render('brother', {brothers: results});
  });
});

app.get('/brothers/:name', function(req, res) {
  db.collection("brothers").findOne({name: req.params.name}, function(err, result) {
    if (err) console.log(err);
    res.render('brother', {brother: result});
  });
});

app.post('/brothers/:name', function(req, res) {
  db.collection("brothers").updateOne({name: req.params.name}, {$set: {class: req.body.class, zeta: req.body.zeta}}, function(err, result) {
    res.redirect('/brothers/' + req.params.name);
  });
});

app.get('/brothers/:name/edit', function(req, res) {
  db.collection("brothers").findOne({name: req.params.name}, function(err, result) {
    if (err) console.log(err);
    res.render('edit_brother', {brother: result});
  });
});

app.get('/brothers/:name/delete', function(req, res) {
  db.collection("brothers").remove({name: req.params.name}, function(err, result) {
    res.redirect('/');
  });
});

app.get('/create', function(req, res) {
  res.render('create_brother');
});

app.post('/create', function(req, res) {
  var brother = {
    name: req.body.name.trim(),
    zeta: req.body.zeta.trim(),
    class: req.body.class.trim(),
  };

  if (brother.name != '' && brother.zeta != '') {
    db.collection('brothers').insert(brother, function(err, result){
      res.redirect('/brothers');
    });
  } else {
    res.render('create_brother', {message: 'Please enter a name and a zeta', brother: req.body});
  }
});
