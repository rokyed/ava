require('dotenv').config()
const colors = require('colors')
const { Pool } = require('pg')
const dbinit = require('./dbinit.js')
const auth = require('./test/auth/auth.js')
const testMethods = require('./test/methods.js')
const {
	APP_PORT = 15000,
	TEST_APP_PORT=15000,
	TEST_APP_URL='',
	TEST = 0,
	BASH_TEST = 0,
	BASH_SIZE = 10
} = process.env
const config = {
	host: `${TEST_APP_URL}:${APP_PORT}`,
	m: testMethods
}

async function test() {
	let pool = new Pool()
	let client = await pool.connect()
	testMethods.legend()
	console.log('Tests started:')
	await dbinit(client)
	console.log('DB init done.')
	console.log('')

	try {
		await auth.test(config)
	} catch (e) {
		console.warn(e)
		console.error(colors.red('FAILED'))
	} finally {
		console.log(colors.green('Done!'))
		process.exit(0)
	}
}

async function bashTest() {
	let pool = new Pool()
	let client = await pool.connect()
	console.log('Tests started:')
	await dbinit(client)
	console.log('DB init done.')
	console.log('')

	try {
		await auth.bashTest(config, BASH_SIZE)
	} catch (e) {
		console.warn(e)
		console.error(colors.red('FAILED'))
	} finally {
		console.log(colors.green('Done!'))
	}
}

if (+TEST !== 1) {
	console.log(`You can't run this in production setup. It will destroy your database!!`)
	process.exit(0)
} else {
	if (+BASH_TEST)
		bashTest()
	else
		test()
}
