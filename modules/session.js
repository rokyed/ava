var express = require('express')
var router = express.Router()
const { Pool } = require('pg')

router.post('/', (req, res, next) => {
	let pool = new Pool()
})

router.get('/', (req, res, next) => {

})



module.exports = router
