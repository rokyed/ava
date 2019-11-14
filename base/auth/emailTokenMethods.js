const utils = require('../../utils.js')

module.exports = {
	generatePasswordResetToken: async function(client, username) {
		console.log('emailTokenMethods:generatePasswordResetToken')
	},

	generateEmailValidateToken: async function(client, username) {
		console.log('emailTokenMethods:generateEmailValidateToken')
	},

	getTokenData: async function(client, token) {
		console.log('emailTokenMethods:getTokenData')
	},

}
