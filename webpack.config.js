const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

let srcPath = path.join(process.cwd(), 'src')
let outputPath = path.join(process.cwd(), 'build')

// load the reusable legacy webpack config from materia-widget-dev
let webpackConfig = require('materia-widget-development-kit/webpack-widget').getLegacyWidgetBuildConfig({
	preCopy: [
		{
			from: srcPath+'/ai.js',
			to: outputPath
		},
		{
			from: srcPath+'/constants.js',
			to: outputPath
		},
		{
			from: srcPath+'/dispatcher.js',
			to: outputPath
		},
		{
			from: srcPath+'/store.js',
			to: outputPath
		},
		{
			from: srcPath+'/actions.js',
			to: outputPath
		}
	]
})

webpackConfig.entry['player.js'] = [path.join(__dirname, 'src', 'player.jsx')]

webpackConfig.module.rules.push({
	test: /\.jsx$/i,
	exclude: /node_modules/,
	loader: ExtractTextPlugin.extract({
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
})

module.exports = webpackConfig
