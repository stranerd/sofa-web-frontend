import { BaseEntity } from '@modules/core'
import { MemberFromModel } from '../../data/models/members'
import { EmbeddedUser, MemberTypes } from '../types'

export class MemberEntity extends BaseEntity {
	public readonly id: string
	public readonly email: string
	public readonly user: EmbeddedUser | null
	public readonly type: MemberTypes
	public readonly organizationId: string
	public readonly pending: boolean
	public readonly withCode: boolean
	public readonly accepted: { is: boolean, at: number } | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, email, user, type, organizationId, pending, withCode, accepted, createdAt, updatedAt }: MemberFromModel) {
		super()
		this.id = id
		this.email = email
		this.user = user
		this.type = type
		this.organizationId = organizationId
		this.pending = pending
		this.withCode = withCode
		this.accepted = accepted
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	search (value: string) {
		if (!value) return true
		return [
			this.email, this.user?.bio.name.full ?? ''
		].some(field => field.toLowerCase().includes(value.toLowerCase()))
	}
}