require('dotenv').config()
const colors = require('colors')
const {
	VERBOSE_TEST=0
} = process.env

function format (testName, pass, err) {
		let pString = ''
		let dash = colors.blue('--->')
		if (pass === undefined) {
			pString = colors.red('NOCONC') // not concluded
		} else {
			pString = pass ? colors.green('PASSED'): colors.red('FAILED')
		}

		console.log(`${pString} ${dash} ${testName}`)

		if (!pass && +VERBOSE_TEST)
			console.error(err)
}

function scenario (name, pass, err) {
	let scenario = colors.magenta('Scenario')
	let cols = colors.grey(':')
	return format(`${scenario}${cols} ${name}`, pass, err)
}

function legend () {
	console.log(`Legend: NOCONC means 'not concluded'`)
}

module.exports = {
	format,
	scenario,
	legend
}
