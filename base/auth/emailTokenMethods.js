const utils = require('../../utils.js')

module.exports = {
	generateToken: async function(client, username, action) {
		console.log('emailTokenMethods:generatePasswordResetToken')
		let randKey = utils.genRandKey()

		await client.query('INSERT INTO emailtoken (token, username, action) VALUES ($1, $2, $3)', [randKey, username, action])

		return randKey
	},

	getTokenData: async function(client, token) {
		console.log('emailTokenMethods:getTokenData')

		let res = await client.query('SELECT username, action FROM emailtoken WHERE token = $1', [token])

		if (res.rows[0])
			return res.rows[0]

		return null
	},

	deleteToken: async function(client, token) {
		console.log('emailTokenMethods.deleteToken')
		await client.query('DELETE FROM emailtoken WHERE token = $1', [token])
	}

}
