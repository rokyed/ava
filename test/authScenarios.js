const axios = require('axios')
const authMethods = require('./authMethods.js')

module.exports = {
	userRegister: async function(c, i) {
		console.log('Scenario: User Register')
		try {
			let token = await authMethods.userRegister(c, i)
			if (!token)
				console.error('FAILED')

			await authMethods.userLogout(c, token)
		} catch (e) {
			console.error(e.message)
		}

		console.log('')

		return true
	},

	userLogin: async function(c, i) {
		console.log('Scenario: User Login')
		try {
			let token = await authMethods.userLogin(c, i)
			if (!token)
				console.error('FAILED')

			await authMethods.userLogout(c, token)
		} catch (e) {
			console.error(e.message)
		}
		console.log('')

		return true
	},

	userGetsUserInfo: async function(c, i) {
		console.log('Scenario: User Gets User Info')
		try {
			let token = await authMethods.userLogin(c, i)

			let userInfo = await authMethods.getUserInfo(c, token)
			if (!userInfo)
				console.error('FAILED')

			await authMethods.userLogout(c, token)
		} catch (e) {
			console.error(e.message)
		}
		console.log('')

		return true
	},

	userChangesUserInfo: async function(c, i) {
		console.log('Scenario: User Changes User Info')
		try {
			let token = await authMethods.userLogin(c, i)

			let userInfo = await authMethods.getUserInfo(c, token)
			if (!userInfo)
				console.error('FAILED')
			else
				console.log(userInfo)

			await authMethods.updateUserInfo(c, token)

			userInfo = await authMethods.getUserInfo(c, token)
			if (!userInfo)
				console.error('FAILED')
			

			await authMethods.userLogout(c, token)
		} catch (e) {
			console.error(e.message)
		}
		console.log('')

		return true
	},

	userTriesToDoActionWithLogin: async function (c, i) {
		console.log('Scenario: User tries to do action with login')
		try {
			let token = await authMethods.userLogin(c, i)
			let data = await authMethods.accessPrivate(c, token)

			if (!data) {
				console.error('FAILED')
			}
			await authMethods.userLogout(c, token)
		} catch (e) {
			console.error(e.message)
		}
		console.log('')

		return true
	},

	userTriesToDoActionWithoutLogin: async function (c) {
		console.log('Scenario: User tries to do action wtihout login')
		try {
			await authMethods.accessPrivate(c, null)
		} catch (e) {
			console.error(e.message)
		}
		console.log('')

		return true
	}
}
