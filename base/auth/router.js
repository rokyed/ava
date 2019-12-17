var express = require('express')
var router = express.Router()
const emailValidator = require("email-validator");
const userMethods = require('./userMethods.js')
const identMethods = require('./identMethods.js')
const roleMethods = require('./roleMethods.js')
const emailTokenMethods = require('./emailTokenMethods.js')
const sessionMethods = require('./sessionMethods.js')

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

	let userinfo = userMethods.autocompleteDefault(req.body.userinfo)
	let token = null

	if (!userMethods.checkLanguage(userinfo.language))
		return next(new Error('Wrong language selected'))

	if (userMethods.checkInputUserInfo(userinfo) !== true) {
		return next(new Error('Missing fields: '+userinfoCheck.join(' ')))
	}

	if (!userMethods.checkPassword(req.body.password, req.body.password_repeat)) {
		return next(new Error('Password missing or not matching'))
	}

	if (!emailValidator.validate(userinfo.email))
		return next(new Error('Email incorrect'))

	try {
		if (await userMethods.checkUsernameExists(req.db_client, req.body.username))
			throw new Error('User already exists')

		if (await userMethods.getUserInfoByEmail(req.db_client, userinfo.email))
			throw new Error('Email already exists')

		await userMethods.createUser(req.db_client, req.body.username, req.body.password)
		await userMethods.createUserInfo(req.db_client, req.body.username, userinfo)
		await roleMethods.createUserRole(req.db_client, req.body.username)

		if (await userMethods.validateUser(req.db_client, req.body.username, req.body.password)) {
			token = await identMethods.getSession(req.db_client, req.body.username)
		} else {
			throw new Error('Wrong user or password')
		}

		await emailTokenMethods.generateEmailValidation(req.db_client, req.body.username, userinfo)
	} catch (e) {
		return next(e)
	}

	res.json({
		success: true,
		token
	})
})

router.route('/test').post(sessionMethods.check, async (req, res, next) => {
	let username = await identMethods.validateSession(req.db_client, req.body.token)
	let role = await roleMethods.getRole(req.db_client, username)

	res.json({
		success: true,
		role
	})
})

router.route('/set/password').post(sessionMethods.check, async (req,res, next) => {
	if (!req.body.old_password)
		return next(new Error('Old password missing'))

	if (!userMethods.checkPassword(req.body.password, req.body.password_repeat))
		return next(new Error('Password missing or not matching'))

	try {
		if (await userMethods.validateUser(req.db_client, req.user_session.username, req.body.old_password)) {
			await userMethods.changePassword(req.db_client, req.user_session.username, req.body.password)
		} else {
			throw new Error('Old password is wrong')
		}
	} catch (e) {
		next (e)
	}

	res.json({
		success: true
	})
})

router.route('/get/userinfo').post(sessionMethods.check, async (req, res, next) => {
	res.json({
		success: true,
		userinfo: req.user_session.userinfo
	})
})

router.route('/set/userinfo').post(sessionMethods.check, async (req, res, next) => {
	let username = req.user_session.username
	let info = req.user_session.userinfo
	let newInfo = req.body.userinfo
	let newUserInfo = null

	for (let k in newInfo) {
		info[k] = newInfo[k]
	}

	if (!userMethods.checkLanguage(newInfo.language))
		return next(new Error('Wrong language selected'))

	try {
		let userinfoByEmail = await userMethods.getUserInfoByEmail(req.db_client, info.email)

		if (userinfoByEmail && userinfoByEmail.username != username)
			throw new Error('Email already used')

		await userMethods.updateUserInfo(req.db_client, username, info)
		newUserInfo = await userMethods.getUserInfo(req.db_client, username)

	} catch (e) {
		next(e)
	}

	res.json({
		success: true,
		userinfo: newUserInfo
	})
})

router.route('/reset/password').post(async (req, res, next) => {
	let emailToken = req.body.email_token

	if (!email_token)
		return next(new Error('Token is missing'))

	if (!userMethods.checkPassword(req.body.password, req.body.password_repeat))
		return next(new Error('Password missing or not matching'))

	let tokenData = await emailTokenMethods.getTokenData(req.db_client, emailToken)

	if (!tokenData || tokenData.action != 'passwordReset')
		return next(new Error('Wrong token'))

	try {
		await userMethods.changePassword(req.db_client, tokenData.username, req.body.password)
		await emailTokenMethods.deleteToken(req.db_client, emailToken)
	} catch (e) {
		return next(new Error('Something went wrong'))
	}

	res.json({
		success: true
	})
})

router.route('/request/reset/password').post(async (req, res, next) => {
	let username = req.body.username
	let email = req.body.email

	if (!username && !email)
		return next(new Error('No info provided'))

	if (username) {

	} else {

	}
})


module.exports = {
	router
}
