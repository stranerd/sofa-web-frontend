import { AnswerFromModel } from '../../data/models/answers'
import { PlayTypes } from '../types'
import { BaseEntity } from '@modules/core'

export class AnswerEntity extends BaseEntity {
	public readonly id: string
	public readonly type: PlayTypes
	public readonly typeId: string
	public readonly userId: string
	public readonly data: Record<string, any>
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, type, typeId, userId, data, createdAt, updatedAt }: AnswerFromModel) {
		super()
		this.id = id
		this.type = type
		this.typeId = typeId
		this.userId = userId
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
