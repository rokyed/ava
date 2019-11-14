require('dotenv').config()
const { Pool } = require('pg')
const dbinit = require('./dbinit.js')
const auth = require('./test/auth.js')
const {
	APP_PORT = 15000,
	TEST = 0
} = process.env
const config = {
	host: `http://localhost:${APP_PORT}`
}

async function test() {
	let pool = new Pool()
	let client = await pool.connect()
	console.log('Tests started:')
	await dbinit(client)
	console.log('DB init done.')
	
	try {
		await auth.test(config)
	} catch (e) {
		console.warn(e)
		console.error('FAILED')
	} finally {
		console.log('Done!')
		process.exit(0)
	}

}

if (! (+TEST)) {
	console.log(`You can't run this in production setup. It will destroy your database!!`)
	process.exit(0)
} else {
	test()
}
