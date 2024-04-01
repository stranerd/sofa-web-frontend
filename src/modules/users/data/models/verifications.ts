import { VerificationAccepted, VerificationContent } from '../../domain/types'

export interface VerificationFromModel extends VerificationToModel {
	id: string
	userId: string
	pending: boolean
	accepted: VerificationAccepted
	createdAt: number
	updatedAt: number
}

export interface VerificationToModel {
	content: VerificationContent
}
