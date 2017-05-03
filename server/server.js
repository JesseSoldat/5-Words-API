require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {Words} = require('./models/words');
const {WordsArray} = require('./models/wordarray');


let {mongoose} = require('./db/mongoose');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/words', (req, res) => {
	let words = new Words({
		user: req.body.user,
		word1: req.body.word1,
		word2: req.body.word2,
		word3: req.body.word3,
		word4: req.body.word4,
		word5: req.body.word5
	});

	words.save().then(doc => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
});

app.post('/words/array', (req, res) => {
	let wordsarray = new WordsArray({
		user:req.body.user,
		words: [req.body.word1, req.body.word2, req.body.word3, req.body.word4, req.body.word5]	 
	});

	wordsarray.save().then(doc => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
});


app.get('/words', (req, res) => {
	Words.find().then(words => {
		res.send({words});
	}, (err) => {
		res.status(400).send(err);
	});
});

//NESTING --------------------------------------------
// app.get('/words/array', (req, res) => {
// 	///words/array/?user=Kelly
// 	let reqUser = req.query.user;

// 	WordsArray.find({user: reqUser}).then((user) => {
// 		//get an array of user words
// 		let userWords = user[0].words;
// 		//return other users that have matching words
// 		WordsArray.find({ words: { $in: userWords } }).then(words => {
// 			//an array of matching users to send back in the response
// 			let resArray = [];
		
// 			words.forEach(object => {
// 				//do not send the current user back
// 				if(object.user === reqUser) {
// 					return;
// 				}
// 				//create an obj for each user that matches
// 				let userObj = {};
// 				//include the user identity
// 				userObj.user = object.user;
				
// 				//takes two arrays and returns matching words into a new array
// 				var matchingWords = _.intersection(userWords, object.words);
// 				//add this array to our user object
// 				userObj.words = matchingWords;
// 				//add each object to our response array
// 				resArray.push(userObj);
// 			});
// 			res.send({resArray});
// 	}, (err) => {
// 		res.status(400).send(err);
// 	});
// 	})
	
// });

//CHAINING---------------------------------------------
app.get('/words/array', (req, res) => {
	///words/array/?user=Kelly
	//words/array/?user=Kelly&num=4;
	let reqUser = req.query.user;
	let reqNum = req.query.num;

	let userWords;

	WordsArray.find({user: reqUser})
	.then((user) => {
		//get an array of user words
		userWords = user[0].words;
		//return other users that have matching words
		return WordsArray.find({ words: { $in: userWords } });
	})
	.then(words => {
		//an array of matching users to send back in the response
		let resArray = [];
	
		words.forEach(object => {
			//do not send the current user back
			if(object.user === reqUser) {
				return;
			}
			//create an obj for each user that matches
			let userObj = {};
			//include the user identity
			userObj.user = object.user;
			
			//takes two arrays and returns matching words into a new array
			var matchingWords = _.intersection(userWords, object.words);
			//add this array to our user object
			userObj.words = matchingWords;
			//add each object to our response array
			resArray.push(userObj);
		});

		//filter option
		if(reqNum) {
			
			//filter array here 
			let filteredArray = resArray.filter(function(obj) {
    		return obj.words.length >= reqNum;
			});

			//sort by the most word matches
			filteredArray.sort(function(a, b) {
	    	return b.words.length - a.words.length;
			});
			
			res.send({filteredArray});
			return;
		}

		//sort by the most word matches
		resArray.sort(function(a, b) {
    	return b.words.length - a.words.length;
		});

		res.send({resArray});
	}, (err) => {
		res.status(400).send(err);
	}).catch(err => {
		console.log(err);
	})	
});

// app.get('/words/array', (req, res) => {
// 	WordsArray.find({ words: { $in: userWords } }).then(words => {
// 		res.send({words});
// 	}, (err) => {
// 		res.status(400).send(err);
// 	});
// });


app.listen(port, () => {
	console.log(`Server running at port:${port}`);
});

module.exports = {app};