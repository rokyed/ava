var express = require('express')
var router = express.Router()
const emailValidator = require("email-validator");
const authMethods = require('./authMethods.js')

router.route('/login').post(async (req, res, next) => {
	let token = null

	try {
		if (await authMethods.validateUser(req.db_client, req.body.username, req.body.password)) {
			await authMethods.deleteAllSessionsFor(req.db_client, req.body.username)
			token = await authMethods.getSession(req.db_client, req.body.username)
		} else {
			throw new Error('wrong user or password')
		}
	} catch (e) {
		return next(e)
	}

	res.json({
		success: true,
		api_token: token
	})
})

router.route('/logout').post(async (req, res, next) => {
	try {
		await authMethods.deleteSession(req.db_client, req.body.session)
	} catch (e) {
		return next(e)
	}

	res.json({
		success: true
	})
})

router.route('/register').post(async (req, res, next) => {
	let k = null
	let userinfoCheck = authMethods.checkInputUserInfo(req.body.userinfo)

	if (userinfoCheck !== true) {
		return next(new Error('missing fields: '+userinfoCheck.join(' ')))
	}

	if (req.body.password != req.body.password_repeat) {
		return next(new Error('password not matching'))
	}

	if (!emailValidator.validate(req.body.userinfo.email))
		return next(new Error('email incorrect'))

	try {
		if (await authMethods.checkUsernameExists(req.db_client, req.body.username))
			throw new Error('user exits already')

		await authMethods.registerUser(req.db_cient, req.body.username, req.body.password, req.body.userinfo)

		if (await authMethods.validateUser(req.db_client, req.body.username, req.body.password)) {
			k = await authMethods.getSession(req.db_client, req.body.username)
		} else {
			throw new Error('wrong user or password')
		}
	} catch (e) {
		return next(e)
	} finally {
		await client.release()
	}

	res.json({
		success: true,
		api_token: k
	})
})

module.exports = router
