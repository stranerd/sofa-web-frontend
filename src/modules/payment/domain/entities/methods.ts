import { MethodData } from '../types'
import { BaseEntity } from '@modules/core'
import { MethodFromModel } from '@modules/payment/data/models/methods'

export class MethodEntity extends BaseEntity {
	public readonly id: string
	public readonly data: MethodData
	public readonly token: string
	public readonly primary: boolean
	public readonly userId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, data, token, primary, userId, createdAt, updatedAt }: MethodFromModel) {
		super()
		this.id = id
		this.data = data
		this.token = token
		this.primary = primary
		this.userId = userId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
