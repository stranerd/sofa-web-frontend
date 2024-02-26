import { DepartmentFromModel } from '../../data/models/departments'
import { BaseEntity } from '@modules/core'

export class DepartmentEntity extends BaseEntity<DepartmentFromModel> {
	constructor(data: DepartmentFromModel) {
		super(data)
	}
}
