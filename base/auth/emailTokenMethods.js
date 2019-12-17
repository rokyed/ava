const utils = require('../../utils.js')
const template = require('../../modules/template.js')
// const nodemailer = require('../../modules/nodemailer.js')

module.exports = {
	generateEmailValidation: async function(client, username, userinfo) {
		//@TODO implement validate user email
		// what  we need: generate email token and send an email to let user know to activate his account
		let emailTpl = template.genTpl('email', 'verifyEmail', userinfo.language, userinfo)
		console.log(emailTpl)
		return true
	},

	generateEmailPasswordReset: async function(client, username, userinfo) {

		return true
	},

	generateToken: async function(client, username, action) {
		utils.log('emailTokenMethods:generatePasswordResetToken')
		let randKey = utils.genRandKey()

		await client.query('INSERT INTO emailtoken (token, username, action) VALUES ($1, $2, $3)', [randKey, username, action])

		return randKey
	},

	getTokenData: async function(client, token) {
		utils.log('emailTokenMethods:getTokenData')

		let res = await client.query('SELECT username, action FROM emailtoken WHERE token = $1', [token])

		if (res.rows[0])
			return res.rows[0]

		return null
	},

	deleteToken: async function(client, token) {
		utils.log('emailTokenMethods.deleteToken')
		await client.query('DELETE FROM emailtoken WHERE token = $1', [token])
	}

}
