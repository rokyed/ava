const axios = require('axios')
const ident = {
	username: 'test',
	password: 'test'
}
const info = {
	first_name: 'a',
	last_name: 'b',
	email: 'test{{i}}@bob.com',
	address: '123 street',
	city: 'city',
	state: 'state',
	country: 'country',
	zip_code: '123456',
	phone_number: '0123456789'
}
const changed = {
	first_name: 'c',
	last_name: 'd',
	language: 'fr'
}
const newIdent = {
	password: 'test2'
}

module.exports = {
	ident,
	info,
	changed,
	userLoginWithoutProperInfo: async (c) => {
		let d = {
			username: 'qwertyqwerty',
			password: 'qwertyqwerty'
		}
		let res = await axios.post(`${c.host}/auth/login`, d)
		// console.log('User Login Without Proper Info: ', res.status, res.data)
		return res.data.token
	},
	userLogin: async (c,iteration = '') => {
		let d = {
			username: ident.username + iteration,
			password: ident.password
		}
		let res = await axios.post(`${c.host}/auth/login`, d)
		// console.log('User Login: ', res.status, res.data)
		return res.data.token
	},

	userLoginWithNewPassword: async (c, iteration = '') => {
		let d = {
			username: ident.username + iteration,
			password: newIdent.password
		}
		let res = await axios.post(`${c.host}/auth/login`, d)
		// console.log('User Login: ', res.status, res.data)
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

		regUsr.userinfo.email = info.email.replace('{{i}}', iteration)

		for (let k in d) {
			regUsr[k] = d[k]
		}

		regUsr.password_repeat = regUsr.password
		let res = await axios.post(`${c.host}/auth/register`, regUsr)
		// console.log('User Register: ', res.status, res.data)
		return res.data.token
	},

	userLogout: async (c,  token) => {
		let res = await axios.post(`${c.host}/auth/logout`, {
			token
		})
		// console.log('User Logout: ', res.status, res.data)
	},

	getUserInfo: async (c, token) => {
		let res = await axios.post(`${c.host}/auth/get/userinfo`, {
			token
		})

		// console.log('Get User Info: ', res.status, res.data)
		return res.data.userinfo
	},

	changePassword: async (c, token) => {
		let res = await axios.post(`${c.host}/auth/set/password`, {
			token,
			password: newIdent.password,
			password_repeat: newIdent.password,
			old_password: ident.password
		})
		// console.log('Change Password: ', res.status, res.data)
	},

	updateUserInfo: async (c, token) => {
		let reqObj = {
			token,
			userinfo: changed
		}

		let res = await axios.post(`${c.host}/auth/set/userinfo`, reqObj)
		// console.log('Update User Info: ', res.status, res.data)
	},

	accessPrivate: async (c, token) => {
		let res = await axios.post(`${c.host}/private/test`, {
			token
		})
		// console.log('Access /private/test: ',res.status, res.data)
		return res.data
	}
}
