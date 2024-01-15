module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		es2022: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'@vue/typescript/recommended',
		'eslint-config-prettier',
		'plugin:prettier/recommended',
	],
	parserOptions: {
		ecmaVersion: 2022,
		parser: '@typescript-eslint/parser',
	},
	rules: {
		'prettier/prettier': 'warn',
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/no-mutating-props': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'no-empty': 'off',
		'vue/no-v-html': 'off',
		'vue/no-v-text-v-html-on-component': 'off',
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: [],
			},
		],
		'vue/component-name-in-template-casing': [
			'error',
			'PascalCase',
			{
				registeredComponentsOnly: false,
				ignores: ['math-field', 'metainfo', 'router-link', 'router-view', 'transition'],
			},
		],
	},
}
