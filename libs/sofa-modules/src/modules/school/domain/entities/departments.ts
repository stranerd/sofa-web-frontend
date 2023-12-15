import { BaseEntity } from '@modules/core'
import { DepartmentFromModel } from '../../data/models/departments'

export class DepartmentEntity extends BaseEntity {
	public readonly id: string
	public readonly name: string
	public readonly institutionId: string
	public readonly facultyId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, name, institutionId, facultyId, createdAt, updatedAt }: DepartmentFromModel) {
		super()
		this.id = id
		this.name = name
		this.institutionId = institutionId
		this.facultyId = facultyId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
