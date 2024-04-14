import { AxiosError } from 'axios'
import { formatNumber, getRandomValue, pluralize } from 'valleyed'
import { reactive } from 'vue'
import { RouteLocationNormalized, RouteLocationNormalizedLoaded, RouteLocationRaw, Router } from 'vue-router'
import { Logic } from '..'
import {
	Confirmation,
	ConfirmationBase,
	ConfirmationSetup,
	ConfirmationSetupBase,
	Listeners,
	LoaderSetup,
	SuccessConfirmation,
	SuccessConfirmationSetup,
} from '../types/common'
import { ValidationError } from '../types/domains/common'
import { formatTime } from '@utils/dates'
import { listenToMany, listenToOne } from '@modules/core'
import { AuthDetails } from '@modules/auth'
import { storage } from '@utils/storage'
import { copyToClipboard, share } from '@utils/commons'

export default class Common {
	#router: Router | undefined = undefined
	#route: RouteLocationNormalizedLoaded | undefined = undefined
	public watchInterval: number | undefined = undefined
	private redirectToName = 'redirect-to'
	public AuthUser: AuthDetails | undefined = undefined

	formatTime = formatTime
	formatNumber = formatNumber
	pluralize = pluralize

	get route() {
		return this.#route!
	}

	set route(route: RouteLocationNormalizedLoaded) {
		this.#route = route
	}

	get router() {
		return this.#router!
	}

	set router(router: Router) {
		this.#router = router
	}

	async getRedirectToRoute() {
		const value = await storage.get<string>(this.redirectToName)
		if (value) await storage.remove(this.redirectToName)
		return value ?? '/dashboard'
	}

	async setRedirectToRoute(value: string) {
		await storage.set(this.redirectToName, value)
	}

	prettifyTime = (seconds: number) => {
		const min = Math.floor(seconds / 60)
		const sec = seconds % 60
		return `${min > 0 ? `${min}m` : ''}${sec > 0 ? `${sec}s` : ''}`
	}

	public async listenToOne<Model, Entity = Model>(
		channel: string,
		listeners: Listeners<Entity>,
		mapper: (model: Model) => Entity = (model) => model as unknown as Entity,
	) {
		return listenToOne<Model, Entity>(channel, listeners, mapper)
	}

	async listenToMany<Model, Entity = Model>(
		channel: string,
		listeners: Listeners<Entity>,
		matches: (entity: Entity) => boolean = () => true,
		mapper: (model: Model) => Entity = (model) => model as unknown as Entity,
	) {
		return listenToMany<Model, Entity>(channel, listeners, mapper, matches)
	}

	public SetRouter = (router: Router) => {
		this.router = router
	}

	public SetRoute = (route: RouteLocationNormalizedLoaded) => {
		this.route = route
	}

	public makeId = () => getRandomValue()

	public showValidationError = (error: AxiosError, formElement: any, customErrorMessage: string | undefined = undefined) => {
		const validationErrors = error?.response?.data as ValidationError[]

		let errorMessage = ''

		if (validationErrors && validationErrors.length) {
			validationErrors.forEach((validation) => {
				formElement?.fieldsToValidate?.[validation.field]?.showError(validation.message)
			})
			errorMessage = validationErrors[0]?.message
		} else errorMessage = error.message

		this.showAlert({
			type: 'error',
			message: customErrorMessage ?? errorMessage,
		})
	}

	public ordinalSuffixOf(i: number) {
		const j = i % 10,
			k = i % 100
		if (j == 1 && k != 11) return i + 'st'
		if (j == 2 && k != 12) return i + 'nd'
		if (j == 3 && k != 13) return i + 'rd'
		return i + 'th'
	}

	public loaderSetup = reactive<LoaderSetup>({
		alerts: [],
		loaders: [],
		loading: false,
	})

	public confirmations = reactive<ConfirmationSetup[]>([])
	public successes = reactive<SuccessConfirmationSetup[]>([])

	public async confirm(confirmation: Confirmation) {
		return this.confirm_logic(this.confirmations, confirmation)
	}

	public async success(confirmation: SuccessConfirmation) {
		return this.confirm_logic(this.successes, confirmation)
	}

	private async confirm_logic<I extends ConfirmationBase, J extends ConfirmationBase & ConfirmationSetupBase>(
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

	public showError = (message: string) => {
		this.showAlert({
			message,
			type: 'error',
		})
	}

	public showLoading = (id?: string) => {
		if (id) this.loaderSetup.loaders.push(id)
		else this.loaderSetup.loading = true
	}

	public hideLoading = (id?: string) => {
		if (id) this.loaderSetup.loaders = this.loaderSetup.loaders.filter((i) => i !== id)
		else this.loaderSetup.loading = false
	}

	public GoToRoute = async (to: RouteLocationRaw) => {
		await this.router?.push(to)
	}

	public goBack = () => {
		const goBackRoute = (this.route?.meta.middlewares as any)?.goBackRoute
		const route =
			typeof goBackRoute === 'function' ? goBackRoute(this.route) : typeof goBackRoute === 'string' ? goBackRoute : undefined
		if (route) return this.router?.push(route)
		const canGoBack = !!this.router?.options.history.state.back
		if (canGoBack) this.router?.go(-1)
		else this.router?.push('/')
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

	public debounce = (key: string, method = () => {}, delay = 500) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (typeof window.LIT !== 'undefined') {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			clearTimeout(window.LIT)
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		window.LIT = setTimeout(() => {
			method()
		}, delay)
	}

	public watchProperty = (objectToWatch: any, objectToUpdate: any) => {
		let upatedValue = (this as any)[`${objectToWatch}`]
		const watchAction = () => {
			upatedValue = (this as any)[objectToWatch]
			if (objectToUpdate) objectToUpdate.value = upatedValue
			this.watchInterval = window.requestAnimationFrame(watchAction)
		}

		watchAction()
	}

	public preFetchRouteData = async (config: RouteConfig, routeTo: RouteLocationNormalized) => {
		const allActions: Promise<unknown>[] = []

		const fetchRules = config.fetchRules ?? []

		for (const rule of fetchRules) {
			if (rule.requireAuth && !Logic.Common.AuthUser) return '/auth/signin'
			if (rule.shouldSkip?.()) continue
			let addRuleToRequest = true

			if (rule.condition) {
				switch (rule.condition.routeSearchItem) {
					case 'fullPath':
						addRuleToRequest = routeTo['fullPath'].includes(rule.condition.searchQuery)
						break
					case 'params':
						addRuleToRequest = routeTo['params'][rule.condition.searchQuery] ? true : false
						break
					case 'query':
						addRuleToRequest = routeTo['query'][rule.condition.searchQuery] ? true : false
						break
					default:
						break
				}
			}

			if (addRuleToRequest) {
				const domain = Logic[rule.domain]
				const method = domain[rule.method as keyof typeof domain] as any

				if (
					domain[rule.property as keyof typeof domain] == undefined ||
					(typeof rule.ignoreProperty == 'function' && rule.ignoreProperty()) ||
					rule.ignoreProperty
				) {
					if (rule.useRouteId) rule.params.unshift(routeTo.params.id.toString())
					if (rule.useRouteQuery)
						rule.queries?.forEach((item) => {
							rule.params.unshift(routeTo.query[item])
						})

					allActions.push(
						new Promise((resolve) => {
							// update userid
							rule.params.forEach((param) => {
								if (typeof param !== 'object') return
								param.where?.forEach((item: any) => {
									if (item.field == 'user.id' || item.field == 'userId') item.value = Logic.Common.AuthUser?.id
								})
							})
							method?.(...rule.params).then(resolve)
						}),
					)
				} else {
					if (rule.silentUpdate) {
						// run in silence
						rule.params = [...new Set(rule.params)]
						method?.(...rule.params)
					}
				}
			}
		}

		if (allActions.length > 0) {
			this.showLoading()
			await Promise.all(allActions)
			this.hideLoading()
		}
	}

	tabIsActive = (tab: string) => {
		if (tab === '/' && this.route.path === '/') return true
		else if (tab !== '/' && this.route.path.startsWith(tab)) return true
		return false
	}

	public async share(title: string, text: string, url = window.location.href) {
		const result = share({ title, text, url })
		if (!result) this.copy(url, 'Link copied to clipboard!')
	}

	public async copy(text: string, message = 'Copied!', type: LoaderSetup['alerts'][number]['type'] = 'success') {
		const result = await copyToClipboard(text)
		if (result) this.showAlert({ message, type })
	}
}
