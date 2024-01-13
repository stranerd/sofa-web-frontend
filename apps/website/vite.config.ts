import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import Checker from 'vite-plugin-checker'
// import Pages from 'vite-plugin-pages'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => ['math-field'].includes(tag),
				},
			},
		}),
		...(isDev ? [
			Checker({
				typescript: true,
				vueTsc: true,
				// eslint: { lintCommand: 'eslint ./src' }
				// stylelint: { lintCommand: 'stylelint ./src/**/*.{css,scss,vue}' }
			})
		] : [])
		/* Pages({
			dirs: 'src/views',
			routeStyle: 'nuxt',
			extendRoute: (route: any) => {
				const path = route.path.split('/')
				const lastIndex = path.length - 1
				if (path[lastIndex] && path[lastIndex].includes(':')) path[lastIndex] = path[lastIndex] + '/'
				return { ...route, path: path.join('/') }
			}
		}), */
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src/application'),
			'@app': path.resolve(__dirname, './src/application'),
			'@modules': path.resolve('./node_modules/sofa-modules/src/modules'),
			'@utils': path.resolve('./node_modules/sofa-modules/src/utils'),
		},
		extensions: ['.js', '.vue', '.json', '.ts'],
	},
	build: {
		minify: 'terser',
	},
	server: {
		port: 8080,
	},
	/* css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import '@app/assets/styles/global.scss';
`
			}
		}
	} */
})
