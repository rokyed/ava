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
	userLogin: async (c,iteration = '') => {
		let d = {
			username: ident.username + iteration,
			password: ident.password
		}
		let res = await axios.post(`${c.host}/auth/login`, d)
		console.log('User Login: ', res.status, res.data)
		return res.data.token
	},

	userRegister: async (c, iteration = '') => {
		let d = {
			username: ident.username + iteration,
			password: ident.password
		}
		let regUsr = {
			userinfo: {}
		}
		for (let k in info) {
			regUsr.userinfo[k] = info[k]
		}

		for (let k in d) {
			regUsr[k] = d[k]
		}

		regUsr.password_repeat = regUsr.password
		let res = await axios.post(`${c.host}/auth/register`, regUsr)
		console.log('User Register: ', res.status, res.data)
		return res.data.token
	},

	userLogout: async (c, token) => {
		let res = await axios.post(`${c.host}/auth/logout`, {
			token
		})
		console.log('User Logout: ', res.status, res.data)
	},

	getUserInfo: async (c, token) => {
		let res = await axios.post(`${c.host}/auth/get/userinfo`, {
			token
		})

		console.log('Get User Info: ', res.status, res.data)
		return res.data.userinfo
	},

	updateUserInfo: async (c, token) => {
		let reqObj = {
			token,
			userinfo: changed
		}

		let res = await axios.post(`${c.host}/auth/set/userinfo`, reqObj)
		console.log('Update User Info: ', res.status, res.data)
	},

	accessPrivate: async (c, token) => {
		let res = await axios.post(`${c.host}/private/test`, {
			token
		})
		console.log('Access /private/test: ',res.status, res.data)
		return res.data
	}
}
