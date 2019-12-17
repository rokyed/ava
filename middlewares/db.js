const {
	POOL_SIZE = 1
} = process.env
const utils = require('../utils.js')
const { Pool } = require('pg')
const POOL = new Pool({
	max: +POOL_SIZE
})

POOL.on('connect', (c) => {
	utils.log('DB: Client connected')
})

POOL.on('remove', (c) => {
	utils.log('DB: Client removed')
})

POOL.on('error', (e, c) => {
	utils.error(e)
})

module.exports = {
	dbConnect: async (req, res, next) => {
		let client = null

		try {
			client = await POOL.connect()
			utils.log('DB: Connection created')
		} catch (e) {
			next(new Error('DB: Failed to connect to databse'))
		}

		if (client) {
			req.db_client = client
			res.on('finish', () => {
				req.db_client.release(true)
				utils.log('DB: Connection released with `finish` event')
			})
			next()
		}
	}
}
