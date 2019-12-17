const saltedMd5 = require('salted-md5')
const MD5_SALT = process.env.MD5_SALT || ''
const SHOW_LOGS = +process.env.SHOW_LOGS || ''

module.exports = {
	encryptedPassword (password) {
		return saltedMd5(password, MD5_SALT)
	},
	genRandKey() {
		return saltedMd5([Math.random(), Math.random(), Math.random(), Date.now()].join(), '')
	},
	log(...args) {
		if (SHOW_LOGS) {
			console.log(...args)
		}
	},
	error(...args) {
		if (SHOW_LOGS) {
			console.error(...args)
		}
	}
}
