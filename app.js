require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const dbMiddleware = require('./middlewares/db.js')
const auth = require('./base/auth/router.js')
const sessionMethods = require('./base/auth/sessionMethods.js')
const private = require('./private/router.js')
const public = require('./public/router.js')
const utils = require('./utils.js')
var app = express()

const {
	TEST = 0,
	APP_PORT = 15000
} = process.env

app.use(bodyParser.json())
app.use((req, res, next) => {
	utils.log('.......................................................................')
	utils.log(req.path)
	utils.log('.......................................................................')
	next()
})
app.use(dbMiddleware.dbConnect)


app.use('/public', public.router)
app.use('/auth', auth.router)
app.use('/private',sessionMethods.check, private.router)

app.use((req, res, next) => {
  return res.status(500).json({
	success: false,
	error: `Route ${req.url} not found.`
  });
})

app.use(function(err, req, res, next) {
	utils.error(err)

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
