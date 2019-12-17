const fs = require('fs')
const path = require('path')
const templatesDir = path.join(__dirname, './templates')
const getAllFiles = function(dirPath, arrayOfFiles) {
	let files = fs.readdirSync(dirPath)

	arrayOfFiles = arrayOfFiles || []

	files.forEach(function(file) {
		if (fs.statSync(dirPath + "/" + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
		} else {
			arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
		}
	})

	return arrayOfFiles
}

const putContentInJSONTree = function(sanitizedPath, content) {
	let splits = sanitizedPath.split('/')
	let tmp = {}

	splits[splits.length - 1] = splits[splits.length - 1].split('.')[0] // keep only the file name not the extention
	splits = splits.reverse()

	for (let k = 0; k < splits.length; k++) {
		if (k == 0) {
			tmp[splits[k]] = content
		} else {
			let newTmp = {}
			newTmp[splits[k]] = tmp
			tmp = JSON.parse(JSON.stringify(newTmp))
		}
	}
	return tmp
}

const mergeBtoA = function(A, B) {
	let merged = JSON.parse(JSON.stringify(A))

	for (let k in B) {
		if (B[k].constructor === Object) {
			if (!merged[k]) {
				merged[k] = B[k]
			} else {
				merged[k] = mergeBtoA(merged[k], B[k])
			}
		} else {
			merged[k] = B[k]
		}
	}

	return merged
}

const getContentOf = function(path) {
	let buf = fs.readFileSync(path)

	return buf.toString()
}

const templates = getAllFiles('./templates')

let templatesJSON = {}

for (let i = 0; i < templates.length; i++) {
	let templateURI = templates[i]
	console.log(templateURI)
	let content = getContentOf(templateURI)
	templatesJSON = mergeBtoA(templatesJSON, putContentInJSONTree(templateURI.replace(templatesDir + '/', ''), content))
}
fs.writeFileSync(path.join(__dirname, 'templates.json'), JSON.stringify(templatesJSON))
