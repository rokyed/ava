require('dotenv').config()
const auth = require('./base/auth/authMethods.js')
const { Pool } = require('pg')
const {
	APP_PORT = 15000,
	TEST = 0
} = process.env
const config = {
	host: `http://localhost:${APP_PORT}`
}


async function init() {
	let pool = new Pool()
	let client = await pool.connect()
	await auth.drop(client)
	await auth.init(client)
	client.release()
}

if (! (+TEST)) {
	console.log(`You can't run this in production setup. It will destroy your database!!`)
	process.exit(0)
} else {
	init()
}
