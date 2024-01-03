import { BaseEntity } from '@modules/core'
import { CourseFromModel } from '../../data/models/courses'

export class CourseEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly institutionId: string
	public readonly facultyId: string | null
	public readonly departmentId: string | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, institutionId, facultyId, departmentId, createdAt, updatedAt }: CourseFromModel) {
		super()
		this.id = id
		this.title = title
		this.institutionId = institutionId
		this.facultyId = facultyId
		this.departmentId = departmentId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
