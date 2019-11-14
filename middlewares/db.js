const {
	POOL_SIZE = 1
} = process.env

const { Pool } = require('pg')
const POOL = new Pool({
	max: +POOL_SIZE
})

POOL.on('connect', (c) => {
	console.log('DB: Client connected')
})

POOL.on('remove', (c) => {
	console.log('DB: Client removed')
})

POOL.on('error', (e, c) => {
	console.error(e)
})

module.exports = {
	dbConnect: async (req, res, next) => {
		let client = null

		try {
			client = await POOL.connect()
			console.log('DB: Connection created')
		} catch (e) {
			throw new Error('DB: Failed to connect to databse')
		}

		if (client) {
			req.db_client = client
			res.on('finish', () => {
				req.db_client.release(true)
				console.log('DB: Connection released with `finish` event')
			})
			next()
		}
	}
}
