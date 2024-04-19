import { Logic } from '../modules'

export interface LoaderSetup {
	loading: boolean
	loaders: string[]
	alerts: { message: string; type: 'success' | 'error' | 'warning' | 'info' }[]
}

interface ConfirmButton {
	label: string
	color: string
	hide: boolean
	bg: string
}

export interface ConfirmationBase {
	title: string
	sub: string
}

export interface ConfirmationSetupBase {
	id: string
	close: (val: boolean) => void
}

export interface Confirmation extends ConfirmationBase {
	left?: Partial<ConfirmButton>
	right?: Partial<ConfirmButton>
}

export interface ConfirmationSetup extends Confirmation, ConfirmationSetupBase {}

export interface SuccessConfirmation extends ConfirmationBase {
	button?: Partial<ConfirmButton>
}

export interface SuccessConfirmationSetup extends SuccessConfirmation, ConfirmationSetupBase {}

type L = typeof Logic
type D = keyof L
type P = string // keyof L[D] // TODO figure out how to make this work

export interface FetchRule {
	domain: D
	property: P
	method: P // & ((...args: any[]) => any)
	params: any[]
	requireAuth?: boolean
	ignoreProperty?: boolean | (() => boolean)
	useRouteId?: boolean
	useRouteQuery?: boolean
	queries?: string[]
	condition?: {
		routeSearchItem: 'fullPath' | 'params' | 'query'
		searchQuery: string
	}
}
