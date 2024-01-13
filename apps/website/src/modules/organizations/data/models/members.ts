import { EmbeddedUser, MemberTypes } from '../../domain/types'

export interface MemberFromModel extends MemberToModel {
	id: string
	withCode: boolean
	pending: boolean
	accepted: { is: boolean; at: number } | null
	user: EmbeddedUser | null
	createdAt: number
	updatedAt: number
}

export interface MemberToModel {
	organizationId: string
	email: string
	type: MemberTypes
}
