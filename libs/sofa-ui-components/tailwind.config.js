module.exports = {
	content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primaryPurple: '#3219AF',
				primaryBlue: '#197DFA',
				primaryOrange: '#FA9632',
				primaryGreen: '#4BAF7D',
				primaryRed: '#E1324B',
				primaryPurplePink: '#AF19C8',
				primaryYellow: '#FFAF4B',
				primaryPink: '#FF4BC8',
				bodyBlack: '#413C46',
				grayColor: '#78828C',
				fadedPurple: '#EFF4F9',
				deepGray: '#141618',
				skyBlue: '#E6F5FF',
				lightGray: '#F1F6FB',
				hoverBlue: '#7DC8FA',
				darkBody: '#050F19',
				darkLightGray: '#E1E6EB',
				lightBlue: '#E2F3FD',
			},
			boxShadow: {
				custom: '0px 4px 4px rgba(8, 0, 24, 0.05)',
				customInverted: '0px -4px 4px rgba(8, 0, 24, 0.05)',
				itemBox: '0px 16px 12px rgba(130, 130, 140, 0.1)',
			},
			borderRadius: {
				custom: '1rem 0.5rem 1rem 0.5rem'
			},
		},
		screens: {
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			mdlg: '1000px',
			// => @media (min-width: 768px) { ... }

			lg: '1580px',
		},
		fontSize: {
			xs: '.73rem',
			sm: '.85rem',
			base: '.90rem',
			lg: '1.0rem',
			xl: '1.11rem',
			'2xl': '1.2rem',
			'3xl': '1.5rem',
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwind-scrollbar-hide'),
		require('tailwind-scrollbar'),
	],
}
