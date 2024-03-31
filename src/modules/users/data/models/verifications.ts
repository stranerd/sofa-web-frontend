import { VerificationContent } from '../../domain/types'

export interface VerificationFromModel extends VerificationToModel {
	id: string
	userId: string
	pending: boolean
	accepted: boolean
	createdAt: number
	updatedAt: number
}

export interface VerificationToModel {
	content: VerificationContent
}
