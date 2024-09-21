import '@total-typescript/ts-reset'
import { SofaButton } from 'sofa-ui-components'

type ConfirmButton = {
	label: string
	color: InstanceType<typeof SofaButton>['$props']['color']
	hide: boolean
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

	type ConfirmationSetupBase<T> = {
		id: string
		close: (val: T) => void
	}

	type Confirmation = ConfirmationBase & {
		left?: Partial<ConfirmButton>
		right?: Partial<ConfirmButton>
	}

	type ConfirmationSetup = Confirmation & ConfirmationSetupBase<boolean>

	type PromptConfirmation = Confirmation & {
		placeholder?: string
		required?: boolean
	}

	type PromptConfirmationSetup = PromptConfirmation & ConfirmationSetupBase<string | undefined>

	type SuccessConfirmation = ConfirmationBase & {
		button?: Partial<ConfirmButton>
	}

	type SuccessConfirmationSetup = SuccessConfirmation & ConfirmationSetupBase<boolean>

	type InferConfirmationReturn<T> = T extends ConfirmationSetupBase<infer R> ? R : never

	type Paths<T> = T extends object ? { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}` }[keyof T] : never
}
