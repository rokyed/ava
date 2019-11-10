const axios = require('axios')


module.exports = {
	userConnect: async function (c) {
		let res = await axios.post(`${c.host}/auth/login`, {
			username: 'test',
			password: 'test'
		})
	},

	userRegister: async function (c) {
		let res = await axios.post(`${c.host}/auth/register`, {
			username: 'test',
			password: 'test',
			passwordRepeat: 'test',
			firstName: 'a',
			lastName: 'b',
			email: 'test@bob.com',

		})
	},

	userLogout: async function (c, token) {
		let res = await axios.post(`${c.host}/auth/logout`, {
			token
		})
	},

	getUserInfo: async function (c) {
		let res = await axios.get(`${c.host}/auth/userinfo`, {
			token
		})
	},

	setUserInfo: async function (c) {
		let res = await axios.post(`${c.host}/auth/userinfo`, {
			token
		})
	},

	test: async function(c) {

	}
}
