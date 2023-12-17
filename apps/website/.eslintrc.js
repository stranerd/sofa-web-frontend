module.exports = {
	'extends': ['../../.eslintrc.js'],
	'settings': {
		'import/resolver': {
			'typescript': {
				'alwaysTryTypes': true,
				'project': ['tsconfig.json', '**/tsconfig.json']
			}
		}
	},
}
