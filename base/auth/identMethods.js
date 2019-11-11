const utils = require('../../utils.js')

module.exports = {
	getSession: async function (client, username) {
		console.log('> getSession')
		let k = utils.genRandKey()

		await client.query('INSERT INTO ident (session, username) values($1, $2)', [k, username])

		return k
	},

	validateSession: async function (client, ident) {

	},

	deleteSession: async function (client, session) {
		console.log('> deleteSession')
		await client.query('DELETE FROM ident where session = $1', [session])
	},

	deleteAllSessionsFor: async function (client, username) {
		console.log('> deleteAllSessionsFor')
		await client.query('DELETE FROM ident where username = $1', [username])
	},
}
