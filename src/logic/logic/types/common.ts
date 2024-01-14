import { Logic } from '../modules'

export { Conditions, EmitTypes, QueryKeys } from '@modules/core'
export type { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface FormRule {
	type:
		| 'isRequired'
		| 'isGreaterThan'
		| 'isLessThan'
		| 'isEqualsTo'
		| 'isGreaterThanOrEqualsTo'
		| 'isLessThanOrEqualsTo'
		| 'isRegex'
		| 'isCondition'
	value: any | undefined
	errorMessage: string | undefined
}

export interface SelectOption {
	key: any
	value: string
	extras?: string
	hasIcon?: boolean
	isImage?: boolean
	isString?: boolean
}

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
	alignCurrency?: boolean
	shouldSkip?: () => boolean
	silentUpdate?: boolean
	condition?: {
		routeSearchItem: 'fullPath' | 'params' | 'query'
		searchQuery: string
	}
}
