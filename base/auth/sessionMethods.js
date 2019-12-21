const userMethods = require('./userMethods.js')
const identMethods = require('./identMethods.js')
const roleMethods = require('./roleMethods.js')

module.exports = {
	check: async function(req, res, next) {
		try {
			let username = await identMethods.validateSession(req.db_client, req.body.token)

			if (!username)
				throw new Error('Not Connected')

			let role = await roleMethods.getRole(req.db_client, username)
			let userinfo = await userMethods.getUserInfo(req.db_client, username)
			let verified = await userMethods.getUserVerified(req.db_client, username)
			
			req.user_session = {
				username,
				role,
				userinfo,
				verified
			}

			next()
		} catch (e) {
			next(e)
		}
	}
}
