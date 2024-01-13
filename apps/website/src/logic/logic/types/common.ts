export { Conditions, EmitTypes, QueryKeys } from '@modules/core'
export type { Listeners, QueryParams, QueryResults } from '@modules/core'

export enum StatusCodes {
	success = '200',
	unuthenticated = '401',
	unauthorized = '403',
	badRequest = '400',
	validationError = '422',
	expiredAccessToken = '461',
}

export type SocketReturn = {
	code: StatusCodes
	message: string
	channel: string
}

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

export interface FetchRule {
	domain: string
	property: string
	method: string
	params: any[]
	requireAuth: boolean
	ignoreProperty: boolean | (() => boolean)
	useRouteId: boolean
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

export interface FormContentRule {
	max: number
	characterToAdd: string
	addAfterCount: number
}
