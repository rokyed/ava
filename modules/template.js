const templates = require('../templates.json')

function render(template, data) {
	let rendered = template

	for (let k in data) {
		let re = new RegExp('\{\{'+k+'\}\}', 'g')
		rendered = rendered.replace(re, data[k])
	}

	return rendered
}

function genTpl(lang, kind, action, data) {
	try {
		return render(templates[kind][lang][action], data)
	} catch (e) {
		throw e
	}
}

module.exports = {
	render,
	genTpl
}
