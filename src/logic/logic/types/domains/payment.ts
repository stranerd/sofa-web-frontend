export interface PaymentMethod {
	hash: string
	id: string
	data: {
		type: string
		last4Digits: string
		country: string
		cardType: string
		expiredAt: number
		expired: boolean
	}
	token: string
	primary: boolean
	userId: string
	createdAt: number
	updatedAt: number
}

export interface Transaction {
	hash: string
	id: string
	userId: string
	email: string
	title: string
	amount: number
	currency: string
	status: string
	data: {
		type: string
	}
	createdAt: number
	updatedAt: number
}

export type Subscription = {
	active: boolean
	current: {
		activatedAt: number
		expiredAt: number
		jobId: string | null
	} | null
	next: {
		renewedAt: number
	} | null
	data: {
		type: 'classes'
		organizationId: string
		classId: string
	}
}

export interface Wallet {
	hash: string
	id: string
	userId: string
	balance: {
		amount: number
		currency: string
	}
	account: {
		country: string
		bankNumber: string
		bankCode: string
		bankName: string
	}
	subscription: {
		data: {
			tutorAidedConversations: number
		}
		active: boolean
		current?: {
			activatedAt: number
			expiredAt: number
			id: string
		}
		next?: {
			id: string
			renewedAt: string
		}
	}
	subscriptions: Subscription[]
	createdAt: number
	updatedAt: number
}

export interface Purchase {
	hash: string
	id: string
	userId: string
	price: {
		amount: number
		currency: string
	}
	data: {
		type: string
		id: string
		userId: string
	}
	createdAt: number
	updatedAt: number
}

export interface Plan {
	hash: string
	id: string
	title: string
	interval: string
	active: boolean
	amount: number
	currency: string
	usersFor: string[]
	data: {
		questions: number
		recordings: number
	}
	features: {
		questions: boolean
		recordings: boolean
	}
	createdAt: number
	updatedAt: number
}

export interface CommercialBanks {
	id: number
	code: string
	name: string
}
