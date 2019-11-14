module.exports = {
	createUserRole: async function(client, username) {
		await client.query('INSERT into userrole (username, role) VALUES ($1, $2)',[username, 'client'])
	},

	getRole: async function (client, username) {
		console.log('roleMethods:getRole')

		let res = await client.query('SELECT role from userrole WHERE username = $1', [username])

		if (res.rows[0]) {
			return res.rows[0].role
		}
		return null
	},

	changeUserRole: async function (client, username, role) {
		console.log('roleMethods:changeUserRole')

		await client.query('UPDATE userrole SET role = $2 WHERE username = $1', [username, role])

		return true
	},

	getAllRoles: async function(client) {
		console.log('roleMethods:getAllRoles')
		
		await client.query('SELECT * FROM roles')

	}
}
