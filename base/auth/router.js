var express = require('express')
var router = express.Router()
const emailValidator = require("email-validator");
const userMethods = require('./userMethods.js')
const identMethods = require('./identMethods.js')
const roleMethods = require('./roleMethods.js')
const emailTokenMethods = require('./emailTokenMethods.js')

router.route('/login').post(async (req, res, next) => {
	let token = null

	try {
		if (await userMethods.validateUser(req.db_client, req.body.username, req.body.password)) {
			await identMethods.deleteAllSessionsFor(req.db_client, req.body.username)
			token = await identMethods.getSession(req.db_client, req.body.username)
		} else {
			throw new Error('wrong user or password')
		}
	} catch (e) {
		return next(e)
	}

	res.json({
		success: true,
		token
	})
})

router.route('/logout').post(async (req, res, next) => {
	try {
		await identMethods.deleteSession(req.db_client, req.body.session)
	} catch (e) {
		return next(e)
	}

	res.json({
		success: true
	})
})

router.route('/register').post(async (req, res, next) => {
	if (!req.body.userinfo)
		return next(new Error('Missing userinfo'))

	let k = null
	let userinfoCheck = userMethods.checkInputUserInfo(req.body.userinfo)

	if (userinfoCheck !== true) {
		return next(new Error('Missing fields: '+userinfoCheck.join(' ')))
	}

	if (req.body.password != req.body.password_repeat) {
		return next(new Error('Password not matching'))
	}

	if (!emailValidator.validate(req.body.userinfo.email))
		return next(new Error('email incorrect'))

	try {
		if (await userMethods.checkUsernameExists(req.db_client, req.body.username))
			throw new Error('User exists already')

		await userMethods.createUser(req.db_client, req.body.username, req.body.password)
		await userMethods.createUserInfo(req.db_client, req.body.username, req.body.userinfo)
		await roleMethods.createUserRole(req.db_client, req.body.username)
		await emailTokenMethods.generateEmailValidateToken(req.db_client, req.body.username)

		if (await userMethods.validateUser(req.db_client, req.body.username, req.body.password)) {
			k = await identMethods.getSession(req.db_client, req.body.username)
		} else {
			throw new Error('Wrong user or password')
		}
	} catch (e) {
		return next(e)
	}

	res.json({
		success: true,
		token: k
	})
})

router.route('/test').post(async (req, res, next) => {
	let val = await identMethods.validateSession(req.db_client, req.body.token)
	let role = await roleMethods.getRole(req.db_client, val)
	console.log(val, role)
})
async function checkSession(req, res, next) {
	let username = await identMethods.validateSession(req.db_client, req.body.token)
	if (!username)
		throw new Error('Not connected')

	let role = await roleMethods.getRole(req.db_client, username)
	let userinfo = await userMethods.getUserInfo(req.db_client, username)

	req.user_session = {
		username,
		role,
		userinfo
	}

	next()
}

module.exports = {
	checkSession,
	router
}
