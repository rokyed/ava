module.exports = {
	init: async function (client) {
		console.log('> creating tables userrole, userinfo, ident, users')
		await client.query('CREATE TABLE users (username varchar(128) NOT NULL PRIMARY KEY, password varchar(512), verified BOOLEAN NOT NULL DEFAULT FALSE)')
		await client.query('CREATE TABLE userinfo (username varchar(128) PRIMARY KEY NOT NULL REFERENCES users(username), first_name varchar(256), last_name varchar(256), address varchar(512), city varchar(256), zip_code varchar(128), state varchar(256), country varchar(256), email varchar(512))')
		await client.query('CREATE TABLE ident (session varchar(128) NOT NULL PRIMARY KEY, username varchar(128) NOT NULL REFERENCES users(username), last_updated TIMESTAMP NOT NULL DEFAULT NOW())')
		await client.query('CREATE TABLE userrole (username varchar(128) PRIMARY KEY NOT NULL REFERENCES users(username), role varchar(128) NOT NULL)')
		await client.query('CREATE TABLE emailtoken (token VARCHAR(512) NOT NULL PRIMARY KEY, username VARCHAR(128) NOT NULL REFERENCES users(username), type VARCHAR(64) NOT NULL)')

	},

	drop: async function (client) {
		console.log('> droping tables userrole, userinfo, ident, users')
		await client.query('DROP TABLE IF EXISTS emailtoken')
		await client.query('DROP TABLE IF EXISTS ident')
		await client.query('DROP TABLE IF EXISTS userinfo')
		await client.query('DROP TABLE IF EXISTS userrole')
		await client.query('DROP TABLE IF EXISTS users')
	}
}
