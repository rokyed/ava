require('dotenv').config()
const authScenarios = require('./authScenarios.js')
const {
	TEST_WITH_ASYNC = 0,
	VERBOSE_TEST = 0
} = process.env

async function testAuth(c, li = '') {
	await authScenarios.userRegister(c, li)
	await authScenarios.userLogin(c, li)
	await authScenarios.userGetsUserInfo(c, li)
	await authScenarios.userChangesUserInfo(c, li)
	await authScenarios.userTriesToDoActionWithLogin(c, li)
	await authScenarios.userTriesToDoActionWithoutLogin(c, li)
	await authScenarios.userChangesPassword(c, li)
	await authScenarios.loginWrongUsernameOrPassword(c, li)
	return true
}

module.exports = {
	test: testAuth,

	bashTest: async function (c, iterations) {
		let d = (new Date()).getTime()
		if (+TEST_WITH_ASYNC) {
			for (let i = 0; i < iterations; i++) {
				let li = (i + 1) + ''
				testAuth(c, li)
			}

			let d2 = (new Date()).getTime()

			console.log(`The process took: ${(d2 - d) / 1000 } seconds`)
		} else {
			let promises = []
			for (let i = 0; i < iterations; i++) {
				let li = (i + 1) + ''
				promises.push(testAuth(c, li))
			}

			Promise.all(promises).then(async () => {
				let d2 = (new Date()).getTime()

				console.log(`The process took: ${(d2 - d) / 1000 } seconds`)
				process.exit(0)
			})
		}
	}
}
