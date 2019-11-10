const auth = require('./base/auth/authMethods.js')

module.exports = async function init(client) {
	try {
		await auth.drop(client)
		await auth.init(client)
	} catch (e) {
		console.error(e)
	}

	client.release()
	return true
}
