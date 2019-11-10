require('dotenv').config()
const {Pool} = require('pg')
const saltedMd5 = require('salted-md5')
const ident = require('./init/ident.js')
const users = require('./init/users.js')
const userinfo = require('./init/userinfo.js')
const organisations = require('./init/organisations.js')
const MD5_SALT = process.env.MD5_SALT || ''
const TEST = process.env.TEST || 0

async function DBInit() {
	const pool = new Pool()
	const client = await pool.connect()
	try {
		//drops in order
		console.log('dropping tables')
		await client.query(organisations.dropQuery)
		await client.query(ident.dropQuery)
		await client.query(userinfo.dropQuery)
		await client.query(users.dropQuery)
		console.log('tables dropped')

		// creates
		console.log('creating tables')
		await client.query(users.createQuery)
		await client.query(userinfo.createQuery)
		await client.query(ident.createQuery)
		await client.query(organisations.createQuery)
		console.log('tables created')
		//inserts
		if (TEST) {
			// inserting base users
			console.log('performing test queries')
			await client.query(users.testQuery, users.testParams)
			await client.query(userinfo.testQuery, userinfo.testParams)
			await client.query(ident.testQuery, ident.testParams)
			await client.query(organisations.testQuery, organisations.testParams)

			// selects
			console.log('performing select queries')
			let res = await client.query(users.selectQuery, users.selectParams)
			console.log(res.rows[0])
			res = await client.query(userinfo.selectQuery, userinfo.selectParams)
			console.log(res.rows[0])
			res = await client.query(ident.selectQuery, ident.selectParams)
			console.log(res.rows[0])
			res = await client.query(organisations.selectQuery, organisations.selectParams)
			console.log(res.rows[0])
		}
		console.log('done')
	}catch (e) {
		console.error(e.stack)
	}finally {
		// Make sure to release the client before any error handling,
		// just in case the error handling itself throws an error.
		client.release()
	}
}


DBInit()
