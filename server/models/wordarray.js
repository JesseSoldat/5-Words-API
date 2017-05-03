const mongoose = require('mongoose');

let WordsArray = mongoose.model('WordsArray', {
	user: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
	},
	words: {
		type: Array,
		required: true,
		minlength: 5,
	}
});

module.exports = {WordsArray};