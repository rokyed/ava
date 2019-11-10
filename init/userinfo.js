const saltedMd5 = require('salted-md5')
const {
	MD5_SALT = ''
} = process.env

module.exports = {
	dropQuery: 'DROP TABLE IF EXISTS userinfo',
	createQuery: 'CREATE TABLE userinfo (id SERIAL PRIMARY KEY, username varchar(128) NOT NULL REFERENCES users(username), first_name varchar(256), last_name varchar(256), address varchar(512), city varchar(256), zipcode varchar(128), state varchar(256), country varchar(256), email varchar(512))',
	testQuery: 'INSERT INTO userinfo (username, first_name, last_name, address, city, state, zipcode, country, email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
	testParams: ['bob', 'bob', 'dilan','street', 'city', 'state', '1k3j4', 'country', 'bob@bobescu.bobescovich'],
	selectQuery: 'SELECT * FROM userinfo WHERE username = $1',
	selectParams: ['bob']
}
