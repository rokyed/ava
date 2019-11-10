module.exports = async (req, res, next) => {
	let pool = new Pool()
	let token = null

	try {
		if (await authMethods.validateUser(req.db_client, req.body.username, req.body.password)) {
			await authMethods.deleteAllSessionsFor(req.db_client, req.body.username)
			token = await authMethods.getSession(req.db_client, req.body.username)
		} else {
			throw new Error('wrong user or password')
		}
	} catch (e) {
		return next(e)
	}

	res.json({
		success: true,
		api_token: token
	})
}
