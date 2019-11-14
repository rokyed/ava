var express = require('express')
var router = express.Router()

router.get('/test', (req, res, next) =>  {
	console.log(req.user_session)
	res.json(req.user_session)
})

module.exports = {
	router
}
