import { CourseFromModel } from '../../data/models/courses'
import { Coursable, CourseMeta, CourseSections, Publishable, Saleable } from '../types'
import { PublishableEntity } from './coursables'

export class CourseEntity extends PublishableEntity implements Publishable, Saleable {
	public readonly coursables: { id: string; type: Coursable }[]
	public readonly sections: CourseSections
	public readonly frozen: Saleable['frozen']
	public readonly price: Saleable['price']
	public readonly meta: Record<CourseMeta, number>

	constructor(data: CourseFromModel) {
		super(data)
		this.coursables = data.coursables
		this.sections = data.sections
		this.frozen = data.frozen
		this.price = data.price
		this.meta = data.meta
	}

	get shareLink() {
		return `${window.location.origin}/marketplace/${this.id}?type=quiz`
	}
}
