const utils = require('../../utils.js')
const defaultValues = require('../../defaultValues.json')
const filter = require('../../filter.json')


module.exports = {
	changePassword: async function (client, username, password) {
		utils.log('userMethods:changePassword')
		await client.query('UPDATE users SET password = $2 WHERE username = $1', [username, utils.encryptedPassword(password)])
	},

	changePasswordWithEmailToken: async function (client, username, emailToken, newPassword) {
		utils.log('userMethods:changePasswordWithEmailToken')

	},

	getUserInfoByEmail: async function(client, email) {
		utils.log('userMethods:checkEmailExists')

		let res = await client.query('SELECT * from userinfo WHERE email = $1', [email])

		if (res.rows[0])
			return res.rows[0]

		return false
	},

	checkUsernameExists: async function (client, username) {
		utils.log('userMethods:checkUsernameExists')

		let res = await client.query('SELECT * from users WHERE username = $1', [username])

		if (res.rows[0])
			return true

		return false
	},

	validateUser: async function (client, username, password) {
		utils.log('userMethods:validateUser')

		let res = await client.query('SELECT * from users WHERE username = $1 and password =$2', [username, utils.encryptedPassword(password)])

		if (res.rows[0]) {
			return true
		} else {
			return false
		}
	},

	verifyUser: async function (client, username) {
		utils.log('userMethods:verifyUser')

		await client.query('UPDATE users SET verified = $2 WHERE username = $1', [username, true])
	},

	createUser: async function (client, username, password) {
		utils.log('userMethods:createUser')

		await client.query('INSERT INTO users (username, password) values ($1, $2)', [username, utils.encryptedPassword(password)])

		return true
	},

	getUserInfo: async function (client, username) {
		utils.log('userMethods:getUserInfo')

		let res = await client.query('SELECT * from userinfo WHERE username = $1', [username])

		return res.rows[0]
	},

	updateUserInfo: async function (client, username, infoObj) {
		utils.log('userMethods:updateUserInfo')

		await client.query('UPDATE userinfo SET first_name = $2, last_name = $3, address = $4, city = $5, state = $6, zip_code = $7, country = $8, email = $9, phone_number = $10, language = $11 WHERE username = $1', [username, infoObj.first_name, infoObj.last_name, infoObj.address, infoObj.city, infoObj.state, infoObj.zip_code, infoObj.country, infoObj.email, infoObj.phone_number, infoObj.language])

		return true
	},

	createUserInfo: async function (client, username, infoObj) {
		utils.log('userMethods:createUserInfo')

		await client.query('INSERT INTO userinfo (username, first_name, last_name, address, city, state, zip_code, country, email, phone_number, language) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [username, infoObj.first_name, infoObj.last_name, infoObj.address, infoObj.city, infoObj.state, infoObj.zip_code, infoObj.country, infoObj.email, infoObj.phone_number, infoObj.language])

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
		utils.log('userMethods:checkInputUserInfo')

		let success = true
		let items = filter.userinfo
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
	},

	checkLanguage: function(language) {
		return filter.language.indexOf(language) > -1
	},

	autocompleteDefault: function(userinfo) {

		if (defaultValues.userinfo) {
				for (let k in defaultValues.userinfo) {
					if (!userinfo[k])
						userinfo[k] = defaultValues.userinfo[k]
				}
		}

		return userinfo
	}
}
