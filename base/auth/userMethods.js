const utils = require('../../utils.js')

module.exports = {
	changePassword: async function (client, username, newPassword) {
		console.log('> changePassword')


	},

	changePasswordWithEmailToken: async function (client, username, emailToken, newPassword) {
		console.log('> changePasswordWithEmailToken')
	},

	checkUsernameExists: async function (client, username) {
		console.log('> checkUsernameExists')
		let res = await client.query('SELECT * from users WHERE username = $1', [username])

		if (res.rows[0])
			return true

		return false
	},

	validateUser: async function (client, username, password) {
		console.log('> validateUser')
		let res = await client.query('SELECT * from users WHERE username = $1 and password =$2', [username, utils.encryptedPassword(password)])

		if (res.rows[0]) {
			return true
		} else {
			return false
		}
	},

	verifyUser: async function (client, username) {
		console.log('> verifyUser')

		await client.query('UPDATE users SET verified = $2 WHERE username = $1', [username, true])
	},

	createUser: async function (client, username, password) {
		console.log('> createUser')

		await client.query('INSERT INTO users (username, password) values ($1, $2)', [username, utils.encryptedPassword(password)])

		return true
	},

	createUserInfo: async function (client, username, infoObj) {
		console.log('> createUserInfo')

		await client.query('INSERT INTO userinfo (username, first_name, last_name, address, city, state, zip_code, country, email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [username, infoObj.first_name, infoObj.last_name, infoObj.address, infoObj.city, infoObj.state, infoObj.zip_code, infoObj.country, infoObj.email])

		return true
	},

	checkInputUserInfo: function(userinfo) {
		console.log('> checkInputUserInfo')
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
