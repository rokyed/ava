const CryptoJS = require('crypto-js')
const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT || ''
const SHOW_LOGS = +process.env.SHOW_LOGS || ''

module.exports = {
	encryptedPassword (password) {
		return CryptoJS.AES.encrypt(password, ENCRYPTION_SALT).toString(CryptoJS.enc.Utf8)
	},
	genRandKey() {
		return CryptoJS.HmacMD5([Math.random(), Math.random(), Math.random(), Date.now()].join(), '')
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
