const axios = require('axios')
const authMethods = require('./authMethods.js')

module.exports = {
	loginWrongUsernameOrPassword: async function (c, i) {
		let name = 'Client tries to login with wrong username or password'
		let pass
		let err
		try {
			await authMethods.userLoginWithoutProperInfo(c)
			pass = false
		} catch (e) {
			pass = true
			err = e
		}

		c.m.scenario(name, pass, err)
		return true
	},
	userRegister: async function(c, i) {
		let name = 'User Register'
		let pass
		let err
		try {
			let token = await authMethods.userRegister(c, i)

			if (!token)
				throw new Error('no token')

			await authMethods.userLogout(c, token)
			pass = true
		} catch (e) {
			pass = false
			err = e
		}
		c.m.scenario(name, pass, err)

		return true
	},

	userLogin: async function(c, i) {
		let name = 'User Login'
		let pass
		let err
		try {
			let token = await authMethods.userLogin(c, i)

			if (!token)
				throw new Error('no token')

			await authMethods.userLogout(c, token)
			pass = true
		} catch (e) {
			pass = false
			err = e
		}

		c.m.scenario(name, pass, err)

		return true
	},

	userGetsUserInfo: async function(c, i) {
		let name = 'User gets user info'
		let pass
		let err

		try {
			let token = await authMethods.userLogin(c, i)

			if (!token)
				throw new Error('no token')

			let userInfo = await authMethods.getUserInfo(c, token)

			if (!userInfo)
				throw new Error('no user info')

			await authMethods.userLogout(c, token)
			pass = true
		} catch (e) {
			pass = false
			err = e
		}

		c.m.scenario(name, pass, err)
		return true
	},

	userChangesPassword: async function (c, i) {
		let name = 'User changes password'
		let pass
		let err

		try {
			let token = await authMethods.userLogin(c, i)

			if (!token)
				throw new Error('no token')

			await authMethods.changePassword(c, token)
			await authMethods.userLogout(c, token)
			token = await authMethods.userLoginWithNewPassword(c, i)

			if (!token)
				throw new Error('no token')

			await authMethods.userLogout(c, token)
			pass = true
		} catch (e) {
			pass = false
			err = e
		}

		c.m.scenario(name, pass, err)

		return true
	},

	userChangesUserInfo: async function(c, i) {
		let name = 'User changes user info'
		let pass
		let err

		try {
			let token = await authMethods.userLogin(c, i)

			if (!token)
				throw new Error('no token')

			let userInfo = await authMethods.getUserInfo(c, token)

			if (!userInfo)
				throw new Error('no user info')
			else {
				for (let k in authMethods.info) {
					if (authMethods.info[k] != userInfo[k])
						throw new Error('info is not exact')
				}
			}

			await authMethods.updateUserInfo(c, token)

			userInfo = await authMethods.getUserInfo(c, token)

			if (!userInfo)
				throw new Error('no user info')
			else {
				for (let k in authMethods.changed) {
					if (authMethods.changed[k] != userInfo[k])
						throw new Error('changed info is not exact')
				}
			}

			await authMethods.userLogout(c, token)
			pass = true
		} catch (e) {
			pass = false
			err = e
		}

		c.m.scenario(name, pass, err)

		return true
	},

	userTriesToDoActionWithLogin: async function (c, i) {
		let name = 'User tries to do private action with login'
		let pass
		let err
		try {
			let token = await authMethods.userLogin(c, i)
			let data = await authMethods.accessPrivate(c, token)

			if (!data)
				throw new Error('')

			await authMethods.userLogout(c, token)
			pass = true
		} catch (e) {
			pass = false
			err = e
		}
		c.m.scenario(name, pass, err)

		return true
	},

	userTriesToDoActionWithoutLogin: async function (c) {
		let name = 'User tries to do private action wtihout login'
		let pass
		let err
		try {
			await authMethods.accessPrivate(c, null)
			pass = false
		} catch (e) {
			pass = true
			err = e
		}
		c.m.scenario(name, pass, err)

		return true
	}
}
