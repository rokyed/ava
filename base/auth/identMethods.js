const utils = require('../../utils.js')

module.exports = {
	getSession: async function (client, username) {
		console.log('identMethods:getSession')

		let k = utils.genRandKey()

		await client.query('INSERT INTO ident (session, username) values($1, $2)', [k, username])

		return k
	},

	validateSession: async function (client, ident) {
		console.log('identMethods:validateSession')

		let res = await client.query('SELECT username from ident  WHERE session = $1', [ident])

		if (res.rows[0])
			return res.rows[0].username

		return false
	},

	deleteSession: async function (client, session) {
		console.log('identMethods:deleteSession')
		
		await client.query('DELETE FROM ident where session = $1', [session])
	},

	deleteAllSessionsFor: async function (client, username) {
		console.log('identMethods:deleteAllSessionsFor')
		await client.query('DELETE FROM ident where username = $1', [username])
	},
}
