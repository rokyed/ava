function format (testName, pass, err) {
		let pString = ''

		if (pass === undefined) {
			pString = 'NOCONC' // not concluded
		} else {
			pString = pass ? 'PASSED': 'FAILED'
		}

		console.log(`${pString} <<>> ${testName}`)

		if (!pass)
			console.error(err)

		console.log('')
}

function scenario (name, pass, err) {
	return format(`Scenario: ${name}`, pass, err)
}

function legend () {
	console.log(`Legend: NOCONC means 'not concluded'`)
}

module.exports = {
	format,
	scenario,
	legend
}
