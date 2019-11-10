const utils = require('../utils.js')

const checkInputUserInfo = function(userinfo) {
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
}

const registerUser = async function (client, username, password, infoObj) {
	console.log('> registerUser')
	await client.query('INSERT INTO users (username, password) values ($1, $2)', [username, utils.encryptedPassword(password)])

	await client.query('INSERT INTO userinfo (username, first_name, last_name, address, city, state, zipcode, country, email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [username, infoObj.first_name, infoObj.last_name, infoObj.address, infoObj.city, infoObj.state, infoObj.zipcode, infoObj.country, infoObj.email])

	return true
}

const validateUser = async function (client, username, password) {
	console.log('> validateUser')
	let res = await client.query('SELECT * from users WHERE username = $1 and password =$2', [username, utils.encryptedPassword(password)])

	if (res.rows[0]) {
		return true
	} else {
		return false
	}
}

const checkUsernameExists = async function (client, username) {
	console.log('> checkUsernameExists')
	let res = await client.query('SELECT * from users WHERE username = $1', [username])

	if (res.rows[0])
		return true

	return false
}

const getSession = async function (client, username) {
	console.log('> getSession')
	let k = utils.genRandKey()

	await client.query('INSERT INTO ident (session, username) values($1, $2)', [k, username])

	return k
}

const deleteAllSessionsFor = async function (client, username) {
	console.log('> deleteAllSessionsFor')
	await client.query('DELETE FROM ident where username = $1', [username])
}

const deleteSession = async function (client, session) {
	console.log('> deleteSession')
	await client.query('DELETE FROM ident where session = $1', [session])
}

const changePasswordWithSession = async function (client, username, session, newPassword) {
	console.log('> changePasswordWithSession')

}

const changePassword = async function (client, username, oldPassword, newPassword) {
	console.log('> changePassword')

}


module.exports = {
	changePassword,
	changePasswordWithSession,
	getSession,
	deleteSession,
	deleteAllSessionsFor,
	checkUsernameExists,
	validateUser,
	registerUser,
	checkInputUserInfo
}
