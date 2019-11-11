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

		return res.data.api_token
	},

	userRegister: async (c) => {
		console.log('registering')
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

		return res.data.api_token
	},

	userLogout: async (c, token) => {
		console.log('logging out')
		let res = await axios.post(`${c.host}/auth/logout`, {
			token
		})
	},

	getUserInfo: async (c) => {
		console.log('getting user info')
		let res = await axios.get(`${c.host}/auth/userinfo`, {
			token
		})
	},

	setUserInfo: async (c) => {
		console.log('setting user info')
		let reqObj = {
			token
		}
		for (let k in this.changed) {
			reqObj[k] = this.changed[k]
		}

		let res = await axios.post(`${c.host}/auth/userinfo`, reqObj)
	},

	test: async function(c) {
		console.log('> testing registering <')
		let token = await this.userRegister(c)
		console.log('current token: ', token)
		await this.userLogout(c, token)

		console.log('> testing login <')
		token = await this.userLogin(c)
		console.log('current token: ', token)
		await this.userLogout(c, token)
	}
}
