const authScenarios = require('./authScenarios.js')
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
		let promises = []
		for (let i = 0; i < iterations; i++) {
			let li = i + ''
			promises.push(authScenarios.userRegister(c, li))
		}

		Promise.all(promises).then(async () => {
			for (let i = 0; i < iterations; i++) {
				let li = i + ''
				await authScenarios.userLogin(c, li)
			}
			process.exit(0)
		})
	}
}
