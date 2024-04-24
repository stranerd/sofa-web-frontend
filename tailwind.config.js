import scrollbar from 'tailwind-scrollbar'
import scrollbarHide from 'tailwind-scrollbar-hide'
import forms from '@tailwindcss/forms'

export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				current: 'currentColor',
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
				purple: '#964DDE',
				deepGray: '#141618',
				lightGray: '#F1F6FA',
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
				custom: '1rem 0.5rem 1rem 0.5rem',
			},
		},
		screens: {
			sm: '420px',
			md: '768px',
			mdlg: '1000px',
			lg: '1280px',
		},
		fontSize: {
			xs: '.73rem',
			sm: '.85rem',
			base: '.90rem',
			lg: '1.0rem',
			xl: '1.11rem',
			'2xl': '1.2rem',
			'3xl': '1.5rem',
			'4xl': '1.75rem',
		},
	},
	plugins: [
		scrollbar,
		scrollbarHide,
		forms({ strategy: 'class' }),
	],
}
