import { CourseFromModel } from '../../data/models/courses'
import { BaseEntity } from '@modules/core'

export class CourseEntity extends BaseEntity<CourseFromModel> {
	constructor(data: CourseFromModel) {
		super(data)
	}
}
