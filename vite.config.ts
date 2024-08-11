import path from 'path'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Checker from 'vite-plugin-checker'
import Compression from 'vite-plugin-compression'
import Pages from 'vite-plugin-pages'
import { watch } from 'vite-plugin-watch'

const skipCompression = !!process.env.SKIP_COMPRESSION
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
		watch({
			pattern: 'public/images/icons/*.svg',
			command: 'npm run icons:types',
		}),
		Pages({
			importMode: 'sync',
			dirs: 'src/application/views',
			routeStyle: 'nuxt',
			extendRoute: (route: any) => {
				const path = route.path.split('/')
				const lastIndex = path.length - 1
				if (path[lastIndex]?.includes(':') && !path[lastIndex].includes('(.*)')) path[lastIndex] = path[lastIndex] + '/'
				return { ...route, path: path.join('/'), props: false }
			},
		}),
		Components({
			dirs: ['src/application/components', 'src/application/layouts'],
			dts: 'src/types/components.d.ts',
			types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
			resolvers: [
				(componentName) => {
					if (componentName.toLowerCase().startsWith('sofa'))
						return {
							name: componentName,
							from: 'sofa-ui-components',
						}
				},
			],
		}),
		...(!skipCompression ? [Compression({ algorithm: 'brotliCompress' })] : []),
		...(isDev
			? [
					Checker({
						typescript: true,
						vueTsc: true,
						// eslint: { lintCommand: 'eslint ./src' }
						// stylelint: { lintCommand: 'stylelint ./src/**/*.{css,scss,vue}' }
					}),
				]
			: []),
	],
	resolve: {
		alias: {
			'@app': path.resolve(__dirname, './src/application'),
			'@modules': path.resolve('./src/modules'),
			'@utils': path.resolve('./src/utils'),
			'sofa-ui-components': path.resolve('./src/ui-components'),
		},
		extensions: ['.js', '.vue', '.json', '.ts'],
	},
	build: {
		minify: 'terser',
		target: 'esnext',
	},
	optimizeDeps: {
		esbuildOptions: {
			target: 'esnext',
		},
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
