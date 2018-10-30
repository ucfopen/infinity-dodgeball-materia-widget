const path = require('path')
const fs = require('fs')
const srcPath = path.join(__dirname, 'src') + path.sep
const outputPath = path.join(__dirname, 'build')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const rules = widgetWebpack.getDefaultRules()
const entries = widgetWebpack.getDefaultEntries()

// using default creator
delete entries['creator.css']
delete entries['creator.js']

entries['player.js'] = [
	path.join(__dirname, 'src', 'dispatcher.js'),
	path.join(__dirname, 'src', 'constants.js'),
	path.join(__dirname, 'src', 'actions.js'),
	path.join(__dirname, 'src', 'store.js'),
	path.join(__dirname, 'src', 'ai.js'),
	path.join(__dirname, 'src', 'player.jsx'),
]

const customReactRule = {
	test: /\.jsx$/i,
	exclude: /node_modules/,
	loader: require('extract-text-webpack-plugin').extract({
		use: [
			'raw-loader',
			{
				loader: 'babel-loader',
				options: {
					presets: ['env', 'react']
				}
			}
		]
	})
}

let customRules = [
	rules.loaderDoNothingToJs,
	rules.loaderCompileCoffee,
	rules.copyImages,
	rules.loadHTMLAndReplaceMateriaScripts,
	rules.loadAndPrefixCSS,
	rules.loadAndPrefixSASS,
	customReactRule // add our custom rule
]

// options for the build
let options = {
	entries: entries,
	moduleRules: customRules,
}

module.exports = widgetWebpack.getLegacyWidgetBuildConfig(options)
