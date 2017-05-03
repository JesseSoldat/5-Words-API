const mongoose = require('mongoose');

let Words = mongoose.model('Words', {
	user: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
	},
	word1: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	word2: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	word3: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	word4: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	word5: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
});

module.exports = {Words};