var express = require('express')
var router = express.Router()

router.post('/test', async (req, res, next) =>  {
	if (req.user_session.role == 'Client') {
		console.log('this is a client')
	}
	console.log(req.user_session)
	res.json({
		success: true,
		user_session: req.user_session
	})
})

module.exports = {
	router
}
