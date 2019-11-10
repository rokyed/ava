const axios = require('axios')


module.exports = {
	ident: {
		username: 'test',
		password: 'test'
	},

	info: {
		first_name: 'a',
		last_name: 'b',
		email: 'test@bob.com',
		address: '123 street',
		city: 'city',
		state: 'state',
		country: 'country',
		zip_code: '123456',
		phone_number: '0123456789'
	},

	changed: {
		first_name: 'c',
		last_name: 'd'
	},

	userLogin: async (c) => {
		let res = await axios.post(`${c.host}/auth/login`, this.ident)

		consolse.log(res)
	},

	userRegister: async (c) => {
		let regUsr = {}
		for (let k in this.info) {
			regUsr[k] = this.info[k]
		}

		for (let k in this.ident) {
			regUsr[k] = this.ident[k]
		}

		regUsr.password_repeat = regUsr.password

		let res = await axios.post(`${c.host}/auth/register`, {
			username: 'test',
			password: 'test',
			password_repeat: 'test',
			first_name: 'a',
			last_name: 'b',
			email: 'test@bob.com',
			address: '123 street',
			city: 'city',
			state: 'state',
			country: 'country',
			zip_code: '123456',
			phone_number: '0123456789'
		})
	},

	userLogout: async (c, token) => {
		let res = await axios.post(`${c.host}/auth/logout`, {
			token
		})
	},

	getUserInfo: async (c) => {
		let res = await axios.get(`${c.host}/auth/userinfo`, {
			token
		})
	},

	setUserInfo: async (c) => {
		let reqObj = {
			token
		}
		for (let k in this.changed) {
			reqObj[k] = this.changed[k]
		}

		let res = await axios.post(`${c.host}/auth/userinfo`, reqObj)
	},

	test: async function(c) {
		await this.userLogin(c)
	}
}
