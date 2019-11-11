module.exports = {
	createUserRole: async function(client, username) {
		await client.query('INSERT into userrole (username, role) VALUES ($1, $2)',[username, 'client'])
	},

	getRole: async function (client, token) {

	},

	changeUserRole: async function (client, username, role) {
		await client.query('UPDATE userrole SET role = $2 WHERE username = $1', [username, role])

		return true
	},

	getAllRoles: async function(client) {
		await client.query('SELECT * FROM roles')

	}
}
