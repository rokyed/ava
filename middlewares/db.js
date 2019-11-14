const { Pool } = require('pg')

module.exports = {
	dbConnect: async (req, res, next) => {
		let pool = new Pool()
		let client = null

		try {
			client = await pool.connect()
		} catch (e) {
			throw new Error('DB: Failed to connect to databse')
		}

		if (client) {
			req.db_client = client
			res.on('finish', () => {
				req.db_client.end()
				console.log('DB: Connection released with `finish` event')
			})
			console.log('DB: Connection created')
			next()
		}
	}
}
