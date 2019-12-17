const templates = require('../templates.json')

function render(template, data) {
	let rendered = template

	for (let k in data) {
		let re = new RegExp('\{\{'+k+'\}\}', 'g')
		rendered = rendered.replace(re, data[k])
	}

	return rendered
}

function genTpl(kind, action, lang, data) {
	return render(templates[kind][lang][action], data)
}

module.exports = {
	render,
	genTpl
}
