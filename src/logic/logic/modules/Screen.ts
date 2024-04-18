import { reactive } from 'vue'

const sizes = {
	sm: 420,
	md: 768,
	mdlg: 1000,
	lg: 1280,
}

type ScreenSize = keyof typeof sizes

export default class Screen {
	#window = reactive({ width: window.innerWidth, height: window.innerHeight })

	constructor() {
		window.addEventListener('resize', () => {
			this.#window.width = window.innerWidth
			this.#window.height = window.innerHeight
		})
	}

	public get width() {
		return this.#window.width
	}

	public get height() {
		return this.#window.height
	}

	public get mobile() {
		return this.lt('md')
	}

	public get desktop() {
		return this.gte('mdlg')
	}

	public get tab() {
		return this.gte('md') && this.lt('mdlg')
	}

	public get lt() {
		return (size: ScreenSize) => this.#window.width < sizes[size]
	}

	public get lte() {
		return (size: ScreenSize) => this.#window.width <= sizes[size]
	}

	public get gt() {
		return (size: ScreenSize) => this.#window.width > sizes[size]
	}

	public get gte() {
		return (size: ScreenSize) => this.#window.width >= sizes[size]
	}
}
