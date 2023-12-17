const config = require('../../libs/sofa-ui-components/tailwind.config.js')
module.exports = {
	...config,
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', '../../libs/sofa-ui-components/src/**/*.{vue,js,ts,jsx,tsx}']
}
