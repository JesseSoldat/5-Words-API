require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


app.listen(port, () => {
	console.log(`Server running at port:${port}`);
});

module.exports = {app};