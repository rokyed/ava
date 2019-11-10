const { Pool } = require('pg')

module.exports = {
	dbConnect: async (req, res, next) => {
		let pool = new Pool()
		let client = await pool.connect()

		req.db_client = client
		res.on('finish', () => {
			req.db_client.release()
			console.log('DB >> connection released with `finish` event')
		})
		console.log('DB >> connection created')
		next()
	}
}
