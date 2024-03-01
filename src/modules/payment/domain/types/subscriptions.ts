export enum PlanDataType {
	tutorAidedConversations = 'tutorAidedConversations',
}

export type PlanData = Record<PlanDataType, number>

type Sub = {
	active: boolean
	methodId: string | null
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

export type Subscription = Sub & {
	data: {
		type: 'classes'
		organizationId: string
		classId: string
	}
}

export type SubscriptionModel = Sub & {
	data: PlanData
	membersDays: number
}
