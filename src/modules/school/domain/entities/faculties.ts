import { FacultyFromModel } from '../../data/models/faculties'
import { BaseEntity } from '@modules/core'

export class FacultyEntity extends BaseEntity<FacultyFromModel> {
	constructor(data: FacultyFromModel) {
		super(data)
	}
}
