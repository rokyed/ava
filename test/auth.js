const axios = require('axios')
const ident = {
	username: 'test',
	password: 'test'
}
const info = {
	first_name: 'a',
	last_name: 'b',
	email: 'test@bob.com',
	address: '123 street',
	city: 'city',
	state: 'state',
	country: 'country',
	zip_code: '123456',
	phone_number: '0123456789'
}
const changed = {
	first_name: 'c',
	last_name: 'd'
}


module.exports = {
	ident,
	info,
	changed,
	userLogin: async (c) => {
		let res = await axios.post(`${c.host}/auth/login`, ident)
		console.log(res.status, res.data)
		return res.data.token
	},

	userRegister: async (c) => {
		let regUsr = {
			userinfo: {}
		}
		for (let k in info) {
			regUsr.userinfo[k] = info[k]
		}

		for (let k in ident) {
			regUsr[k] = ident[k]
		}

		regUsr.password_repeat = regUsr.password
		let res = await axios.post(`${c.host}/auth/register`, regUsr)
		console.log(res.status, res.data)
		return res.data.token
	},

	userLogout: async (c, token) => {
		let res = await axios.post(`${c.host}/auth/logout`, {
			token
		})
		console.log(res.status, res.data)
	},

	getUserInfo: async (c, token) => {
		let res = await axios.get(`${c.host}/auth/userinfo`, {
			token
		})

		console.log(res.status, res.data)
		return res.data.user_info
	},

	updateUserInfo: async (c, token) => {
		let reqObj = {
			token,
			update: {}
		}
		for (let k in this.changed) {
			reqObj.update[k] = this.changed[k]
		}

		let res = await axios.post(`${c.host}/auth/userinfo`, reqObj)
		console.log(res.status, res.data)
	},

	scenarioUserRegister: async function(c) {
		console.log('Scenario: User Register')

		let token = await this.userRegister(c)
		if (!token)
			console.error('FAILED')
		else
			console.log('current token: ', token)

		await this.userLogout(c, token)

		return true
	},

	scenarioUserLogin: async function(c) {
		console.log('Scenario: User Login')

		let token = await this.userLogin(c)
		if (!token)
			console.error('FAILED')
		else
			console.log('current token: ', token)

		await this.userLogout(c, token)

		return true
	},

	scenarioUserGetsUserInfo: async function(c) {
		console.log('Scenario: User Gets User Info')

		let token = await this.userLogin(c)

		let userInfo = await this.getUserInfo(c, token)
		if (!userInfo)
			console.error('FAILED')
		else
			console.log(userInfo)

		await this.userLogout(c, token)

		return true
	},

	scenarioUserChangesUserInfo: async function(c) {
		console.log('Scenario: User Changes User Info')

		let token = await this.userLogin(c)

		let userInfo = await this.getUserInfo(c, token)
		if (!userInfo)
			console.error('FAILED')
		else
			console.log(userInfo)

		await this.updateUserInfo(c, token)

		userInfo = await this.getUserInfo(c, token)
		if (!userInfo)
			console.error('FAILED')
		else
			console.log(userInfo)

		await this.userLogout(c, token)

		return true
	},

	test: async function(c) {
		await this.scenarioUserRegister(c)
		await this.scenarioUserLogin(c)
		await this.scenarioUserGetsUserInfo(c)
		await this.scenarioUserChangesUserInfo(c)
		let token = await this.userLogin(c)
		await axios.post(`${c.host}/private/test`, {
			token
		})
		await this.userLogout(c, token)
		return
	}
}
