const express = require('express')
const router = express.Router()
const utils = require('../utils.js')

router.post('/test', async (req, res, next) =>  {
	if (req.user_session.role == 'Client') {
		utils.log('this is a client')
	}
	utils.log(req.user_session)
	res.json({
		success: true,
		user_session: req.user_session
	})
})

module.exports = {
	router
}
