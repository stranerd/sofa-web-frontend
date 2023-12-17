import { BaseEntity } from '@modules/core'
import { LessonFromModel } from '../../data/models/lessons'
import { LessonMembers } from '../types'

export class LessonEntity extends BaseEntity {
	public readonly id: string
	public readonly organizationId: string
	public readonly classId: string
	public readonly title: string
	public readonly users: LessonMembers
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, organizationId, classId, title, users, createdAt, updatedAt }: LessonFromModel) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.classId = classId
		this.title = title
		this.users = users
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
