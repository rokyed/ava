require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const dbMiddleware = require('./middlewares/db.js')
const auth = require('./base/auth/router.js')
const private = require('./private/router.js')
const public = require('./public/router.js')
var app = express()

const {
	TEST = 0,
	APP_PORT = 15000
} = process.env

app.use(bodyParser.json())
app.use(dbMiddleware.dbConnect)
app.use((req, res, next) => {
	console.log('.......................................................................')
	console.log(req.path)
	console.log('.......................................................................')
	next()
})

app.use('/public', public.router)
app.use('/auth', auth.router)
app.use('/private',auth.checkSession, private.router)

app.use((req, res, next) => {
  return res.status(500).json({
	success: false,
	error: `Route ${req.url} not found.`
  });
})

app.use(function(err, req, res, next) {
	console.error(err)

	if (TEST != 0) {
		return res.status(500).json({
			success: false,
			error: err.message
		});
	}

	return res.status(500).json({
		success: false
	});
});

app.listen(APP_PORT)
