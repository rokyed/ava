const utils = require('../utils.js')
var password = utils.encryptedPassword('bob')

module.exports = {
	dropQuery: 'DROP TABLE IF EXISTS users',
	createQuery: 'CREATE TABLE users (username varchar(128) NOT NULL PRIMARY KEY, password varchar(512))',
	testQuery: 'INSERT INTO users (username, password) VALUES ($1,$2)',
	testParams: ['bob', password],
	selectQuery: 'SELECT * FROM users WHERE username = $1 AND password = $2',
	selectParams: ['bob', password]
}
