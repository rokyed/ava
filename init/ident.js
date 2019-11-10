const saltedMd5 = require('salted-md5')

module.exports = {
	dropQuery: 'DROP TABLE IF EXISTS ident',
	createQuery: 'CREATE TABLE ident (session varchar(128) NOT NULL PRIMARY KEY, username varchar(128) NOT NULL REFERENCES users(username), created TIMESTAMP NOT NULL DEFAULT NOW())',
	testQuery: 'INSERT INTO ident (session, username) values($1, $2)',
	testParams: [saltedMd5('bob' + Date.now(), ''), 'bob'],
	selectQuery: 'select * from ident where username = $1',
	selectParams: ['bob']
}
