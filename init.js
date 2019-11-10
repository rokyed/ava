require('dotenv').config()
const dbinit = require('./dbinit.js')
const { Pool } = require('pg')
const {
	APP_PORT = 15000,
	TEST = 0
} = process.env
const config = {
	host: `http://localhost:${APP_PORT}`
}

if (! (+TEST)) {
	console.log(`You can't run this in production setup. It will destroy your database!!`)
	process.exit(0)
} else {
	try {
		(async ()=> {
			let pool = new Pool()
			let client = await pool.connect()
			await dbinit(client)
			console.log('initialization of database done!!')
			process.exit(0)
		})()
	} catch(e) {
		console.error(e)
	}
}
