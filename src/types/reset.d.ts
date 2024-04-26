import '@total-typescript/ts-reset'

type ConfirmButton = {
	label: string
	color: string
	hide: boolean
	bg: string
}

declare global {
	interface Window {
		FlutterwaveCheckout: (args: object) => { close: () => void }
	}

	type LoaderSetup = {
		loading: boolean
		loaders: string[]
		alerts: { message: string; type: 'success' | 'error' | 'warning' | 'info' }[]
	}

	type ConfirmationBase = {
		title: string
		sub: string
	}

	type ConfirmationSetupBase = {
		id: string
		close: (val: boolean) => void
	}

	type Confirmation = ConfirmationBase & {
		left?: Partial<ConfirmButton>
		right?: Partial<ConfirmButton>
	}

	type ConfirmationSetup = Confirmation & ConfirmationSetupBase

	type SuccessConfirmation = ConfirmationBase & {
		button?: Partial<ConfirmButton>
	}

	type SuccessConfirmationSetup = SuccessConfirmation & ConfirmationSetupBase

	type Paths<T> = T extends object ? { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}` }[keyof T] : never
}
