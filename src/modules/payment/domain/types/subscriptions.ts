import { SelectedPaymentMethod } from './purchases'

export enum PlanDataType {
	tutorAidedConversations = 'tutorAidedConversations',
}

export type PlanData = Record<PlanDataType, number>

type Sub<G = true> = {
	active: boolean
	methodId: SelectedPaymentMethod
	current:
		| ({
				activatedAt: number
				expiredAt: number
				jobId: string | null
		  } & (G extends true ? object : { id: string }))
		| null
	next: {
		renewedAt: number
	} | null
}

export type Subscription = Sub<true> & {
	data: {
		type: 'classes'
		organizationId: string
		classId: string
	}
}

export type SubscriptionModel = Sub<false> & {
	data: PlanData
	membersDays: number
}
