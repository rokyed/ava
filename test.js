require('dotenv').config()

const auth = require('./test/auth.js')
const {
	APP_PORT = 15000,
	TEST = 0
} = process.env
const config = {
	host: `http://localhost:${APP_PORT}`
}

async function test() {
	auth.test(config)
}

if (! (+TEST)) {
	console.log(`You can't run this in production setup. It will destroy your database!!`)
	process.exit(0)
} else {
	test()
}
