const express = require('express')
const app = express()
require('dotenv').config()
const server = require('http').Server(app)
const bodyParser = require('body-parser')

// Database connection
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Routes initalisation
let webhook = require('./routes/webhook')
app.use('/webhook', webhook)
if (process.env.NODE_ENV=='expose ') {
	
}

app.set('port', (process.env.PORT || 8000));

server.listen(app.get('port'), function () {
	console.log('Server started on port ' + app.get('port'));
});