const utils = require('../../utils.js')

module.exports = {
	changePassword: async function (client, username, password) {
		console.log('userMethods:changePassword')
		await client.query('UPDATE users SET password = $2 WHERE username = $1', [username, utils.encryptedPassword(password)])
	},

	changePasswordWithEmailToken: async function (client, username, emailToken, newPassword) {
		console.log('userMethods:changePasswordWithEmailToken')

	},

	getUserInfoByEmail: async function(client, email) {
		console.log('userMethods:checkEmailExists')

		let res = await client.query('SELECT * from userinfo WHERE email = $1', [email])

		if (res.rows[0])
			return res.rows[0]

		return false
	},

	checkUsernameExists: async function (client, username) {
		console.log('userMethods:checkUsernameExists')

		let res = await client.query('SELECT * from users WHERE username = $1', [username])

		if (res.rows[0])
			return true

		return false
	},

	validateUser: async function (client, username, password) {
		console.log('userMethods:validateUser')

		let res = await client.query('SELECT * from users WHERE username = $1 and password =$2', [username, utils.encryptedPassword(password)])

		if (res.rows[0]) {
			return true
		} else {
			return false
		}
	},

	verifyUser: async function (client, username) {
		console.log('userMethods:verifyUser')

		await client.query('UPDATE users SET verified = $2 WHERE username = $1', [username, true])
	},

	createUser: async function (client, username, password) {
		console.log('userMethods:createUser')

		await client.query('INSERT INTO users (username, password) values ($1, $2)', [username, utils.encryptedPassword(password)])

		return true
	},

	getUserInfo: async function (client, username) {
		console.log('userMethods:getUserInfo')

		let res = await client.query('SELECT * from userinfo WHERE username = $1', [username])

		return res.rows[0]
	},

	updateUserInfo: async function (client, username, infoObj) {
		console.log('userMethods:updateUserInfo')

		await client.query('UPDATE userinfo SET first_name = $2, last_name = $3, address = $4, city = $5, state = $6, zip_code = $7, country = $8, email = $9 WHERE username = $1', [username, infoObj.first_name, infoObj.last_name, infoObj.address, infoObj.city, infoObj.state, infoObj.zip_code, infoObj.country, infoObj.email])

		return true
	},

	createUserInfo: async function (client, username, infoObj) {
		console.log('userMethods:createUserInfo')

		await client.query('INSERT INTO userinfo (username, first_name, last_name, address, city, state, zip_code, country, email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [username, infoObj.first_name, infoObj.last_name, infoObj.address, infoObj.city, infoObj.state, infoObj.zip_code, infoObj.country, infoObj.email])

		return true
	},

	checkPassword: function(pwd, pwdRep) {
		if (!pwd)
			return false

		if (!pwdRep)
			return false

		return pwd === pwdRep
	},

	checkInputUserInfo: function(userinfo) {
		console.log('userMethods:checkInputUserInfo')

		let success = true
		let items = ['first_name', 'last_name', 'address', 'city', 'state', 'zip_code', 'country', 'email']
		let missing = []

		for (let k = 0; k < items.length; k++) {
			if (!userinfo[items[k]]){
				success = false
				missing.push(items[k])
			}
		}

		if (!success) {
			return missing
		}

		return success
	}
}
