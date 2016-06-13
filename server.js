var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist',['crypt']);
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var morgan = require('morgan');


app.use(morgan('dev'));

db.on('error', function (err) {
	console.log('database error', err)
});
 
db.on('connect', function () {
	console.log('database connected')
});

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/AuthForm' ));

app.get('/reps', function(req, res){

	db.crypt.find(function(err, docs){
		err ? console.log(err) : res.json(docs);
	});
});

app.post('/reps', function(req, res){
	console.log(req.body.user);
	console.log(req.body.pass);

  bcrypt.genSalt(10, function(err, salt){
  	bcrypt.hash(req.body.pass, salt, function(err, hash){
  		console.log(hash);
  		db.crypt.insert({"user": req.body.user, "pass": hash}, function(err, data){
  			console.log(data);
  			res.json(data);
  		});
  	});
  });	
});


app.put('/reps', function(req, res){
 	console.log(req.body.user);
 	console.log(req.body.pass);

 	db.crypt.find({"user": req.body.user}, function(err, data){
 		if(data.length > 0){
 		bcrypt.compare(req.body.pass, data[0].pass, function(err, predicate){
 				console.log(predicate);
 				res.send(predicate);
 		});
 		} else {
 			res.send(false);
 		}
 	});
});


app.delete('/reps/:id', function(req, res){
	 var id = req.params.id;
	console.log(id);
	db.crypt.remove({_id: mongojs.ObjectId(id)}, function(err, data){
		res.json(data);
	});
});


app.listen(process.env.PORT || 8888, function(){
		console.log("Check This! 8888");
	});
