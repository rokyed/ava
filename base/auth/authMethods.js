const utils = require('../../utils.js')

module.exports = {
	changePassword: async function (client, username, oldPassword, newPassword) {
		console.log('> changePassword')
	},

	changePasswordWithSession: async function (client, username, session, newPassword) {
		console.log('> changePasswordWithSession')
	},

	getSession: async function (client, username) {
		console.log('> getSession')
		let k = utils.genRandKey()

		await client.query('INSERT INTO ident (session, username) values($1, $2)', [k, username])

		return k
	},

	deleteSession: async function (client, session) {
		console.log('> deleteSession')
		await client.query('DELETE FROM ident where session = $1', [session])
	},

	deleteAllSessionsFor: async function (client, username) {
		console.log('> deleteAllSessionsFor')
		await client.query('DELETE FROM ident where username = $1', [username])
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

	registerUser: async function (client, username, password, infoObj) {
		console.log('> registerUser')
		await client.query('INSERT INTO users (username, password) values ($1, $2)', [username, utils.encryptedPassword(password)])

		await client.query('INSERT INTO userinfo (username, first_name, last_name, address, city, state, zipcode, country, email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [username, infoObj.first_name, infoObj.last_name, infoObj.address, infoObj.city, infoObj.state, infoObj.zipcode, infoObj.country, infoObj.email])


		await client.query('INSERT into userrole (username, role) VALUES ($1, $2)',[username, 'client'])

		return true
	},

	checkInputUserInfo: function(userinfo) {
		console.log('> checkInputUserInfo')
		let success = true
		let items = ['first_name', 'last_name', 'address', 'city', 'state', 'zipcode', 'country', 'email']
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


	changeUserRole: async function (client, username, role) {
		await client.query('UPDATE userrole SET role = $2 WHERE username = $1', [username, role])

		return true
	},

	init: async function (client) {
		await client.query('CREATE TABLE users (username varchar(128) NOT NULL PRIMARY KEY, password varchar(512))')
		await client.query('CREATE TABLE userinfo (username varchar(128) PRIMARY KEY NOT NULL REFERENCES users(username), first_name varchar(256), last_name varchar(256), address varchar(512), city varchar(256), zipcode varchar(128), state varchar(256), country varchar(256), email varchar(512))')
		await client.query('CREATE TABLE ident (session varchar(128) NOT NULL PRIMARY KEY, username varchar(128) NOT NULL REFERENCES users(username), created TIMESTAMP NOT NULL DEFAULT NOW())')
		await client.query('CREATE TABLE userrole (username varchar(128) PRIMARY KEY NOT NULL REFERENCES users(username), role varchar(128) NOT NULL)')
	},
	
	drop: async function (client) {
		await client.query('DROP TABLE IF EXISTS ident')
		await client.query('DROP TABLE IF EXISTS userinfo')
		await client.query('DROP TABLE IF EXISTS userrole')
		await client.query('DROP TABLE IF EXISTS user')
	}
}
