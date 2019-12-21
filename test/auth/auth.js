require('dotenv').config()
const authScenarios = require('./authScenarios.js')
const {
	TEST_WITH_ASYNC = 0
} = process.env

module.exports = {
	test: async function(c) {
		await authScenarios.userRegister(c)
		await authScenarios.userLogin(c)
		await authScenarios.userGetsUserInfo(c)
		await authScenarios.userChangesUserInfo(c)
		await authScenarios.userTriesToDoActionWithLogin(c)
		await authScenarios.userTriesToDoActionWithoutLogin(c)
		await authScenarios.userChangesPassword(c)
		await authScenarios.loginWrongUsernameOrPassword(c)
	},

	bashTest: async function (c, iterations) {
		if (+TEST_WITH_ASYNC) {
			for (let i = 0; i < iterations; i++) {
				let li = (i + 1) + ''
				await authScenarios.userRegister(c, li)
				await authScenarios.userLogin(c, li)
				await authScenarios.userGetsUserInfo(c, li)
				await authScenarios.userChangesUserInfo(c, li)
				await authScenarios.userTriesToDoActionWithLogin(c, li)
				// await authScenarios.userTriesToDoActionWithoutLogin(c, li)
				await authScenarios.userChangesPassword(c, li)
				// await authScenarios.loginWrongUsernameOrPassword(c, li)
			}
		} else {
			let promises = []
			for (let i = 0; i < iterations; i++) {
				let li = (i + 1) + ''
				promises.push(authScenarios.userRegister(c, li))
			}

			Promise.all(promises).then(async () => {
				for (let i = 0; i < iterations; i++) {
					let li = (i + 1) + ''
					authScenarios.userLogin(c, li)
				}
				process.exit(0)
			})
		}
	}
}
