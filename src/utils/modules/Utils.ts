import { formatNumber, getRandomValue, pluralize } from 'valleyed'
import { reactive } from 'vue'
import { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { copyToClipboard, ordinalSuffixOf, share } from '../commons'
import * as constants from '../constants'
import { formatDateAsDigits, formatTime, getDigitalTime } from '../dates'
import * as environment from '../environment'
import { storage } from '../storage'

export default class Utils {
	#router: Router | undefined = undefined
	#route: RouteLocationNormalizedLoaded | undefined = undefined
	#redirectToName = 'redirect-to'
	#debounces: Record<string, ReturnType<typeof setTimeout>> = {}

	get router() {
		return this.#router!
	}

	constants = constants
	environment = environment
	getDigitalTime = getDigitalTime
	formatDateAsDigits = formatDateAsDigits
	formatTime = formatTime
	formatNumber = formatNumber
	pluralize = pluralize
	ordinalSuffixOf = ordinalSuffixOf
	getRandomValue = getRandomValue

	async getRedirectToRoute() {
		const value = await storage.get<string>(this.#redirectToName)
		if (value) await storage.remove(this.#redirectToName)
		return value ?? '/dashboard'
	}

	async setRedirectToRoute(value: string) {
		await storage.set(this.#redirectToName, value)
	}

	public setRouter = (router: Router) => {
		this.#router = router
	}

	public setRoute = (route: RouteLocationNormalizedLoaded) => {
		this.#route = route
	}

	public loaderSetup = reactive<LoaderSetup>({
		alerts: [],
		loaders: [],
		loading: false,
	})

	public confirmations = reactive<ConfirmationSetup[]>([])
	public successes = reactive<SuccessConfirmationSetup[]>([])

	public async confirm(confirmation: Confirmation) {
		return this.#confirmLogic(this.confirmations, confirmation)
	}

	public async success(confirmation: SuccessConfirmation) {
		return this.#confirmLogic(this.successes, confirmation)
	}

	async #confirmLogic<I extends ConfirmationBase, J extends ConfirmationBase & ConfirmationSetupBase>(
		confirmations: J[],
		confirmation: I,
	) {
		return new Promise<boolean>((res) => {
			const id = getRandomValue()
			confirmations.push({
				...confirmation,
				id,
				close: (val: boolean) => {
					const index = confirmations.findIndex((c) => c.id === id)
					if (index === -1) return res(false)
					confirmations.splice(index, 1)
					res(val)
				},
			} as any)
		})
	}

	public showAlert = (alert: LoaderSetup['alerts'][number]) => {
		this.loaderSetup.alerts.push(alert)
	}

	public showLoading = (id: string) => {
		this.loaderSetup.loaders.push(id)
	}

	public hideLoading = (id: string) => {
		this.loaderSetup.loaders = this.loaderSetup.loaders.filter((i) => i !== id)
	}

	public goBack = () => {
		const goBackRoute = (this.#route?.meta.middlewares as any)?.goBackRoute
		const route =
			typeof goBackRoute === 'function' ? goBackRoute(this.#route) : typeof goBackRoute === 'string' ? goBackRoute : undefined
		if (route) return this.#router?.push(route)
		const canGoBack = !!this.#router?.options.history.state.back
		if (canGoBack) this.#router?.go(-1)
		else this.#router?.push('/')
	}

	public daysDiff(a: Date, b: Date) {
		const _MS_PER_DAY = 1000 * 60 * 60 * 24
		const utc1 = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime()
		const utc2 = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
		return Math.floor((utc2 - utc1) / _MS_PER_DAY)
	}

	public getCurrency(currency: string) {
		const currencies = {
			NGN: '₦',
			USD: '$',
		}
		return currencies[currency.toUpperCase() as keyof typeof currencies] ?? ''
	}

	public formatPrice = (price: number, currency = 'NGN') =>
		`${price < 0 ? '-' : ''}${this.getCurrency(currency)}${Intl.NumberFormat().format(Math.abs(price))}`

	public debounce = (key: string, method: () => void, delay = 500) => {
		if (key in this.#debounces) clearTimeout(this.#debounces[key])
		this.#debounces[key] = setTimeout(async () => {
			await method()
			delete this.#debounces[key]
		}, delay)
	}

	tabIsActive = (tab: string) => {
		if (tab === '/') return this.#route?.path === '/'
		if (tab === '/dashboard') return this.#route?.path === '/dashboard'
		return this.#route?.path.startsWith(tab)
	}

	public async share(title: string, text: string, url = window.location.href) {
		const result = await share({ title, text, url })
		if (!result) this.copy(url, 'Link copied to clipboard!')
	}

	public async copy(text: string, message = 'Copied!', type: LoaderSetup['alerts'][number]['type'] = 'success') {
		const result = await copyToClipboard(text)
		if (result) this.showAlert({ message, type })
	}

	rotate<T>(array: T[], by: number) {
		const trimmed = by % array.length
		const rotateBy = trimmed < 0 ? array.length + by : by
		return array.slice(rotateBy).concat(array.slice(0, rotateBy))
	}

	deepGet<T, R>(obj: T, key: Paths<T>) {
		return key.split('.').reduce((acc, cur) => (acc && (acc as any)[cur] ? (acc as any)[cur] : undefined), obj as unknown as R)
	}
}
