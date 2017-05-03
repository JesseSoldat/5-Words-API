require('./config/config');

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


app.get('/words/array', (req, res) => {
	let user = req.query.user;
	console.log(user); //Kelly
	WordsArray.find({user: user}).then((user) => {
		// console.log(user.words);
		words = user[0].words;
		WordsArray.find({ words: { $in: words } }).then(words => {
		res.send({words});
	}, (err) => {
		res.status(400).send(err);
	});
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