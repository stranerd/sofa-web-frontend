import { CourseFromModel } from '../../data/models/courses'
import { Coursable, CourseMeta, CourseSection, Publishable, Saleable } from '../types'
import { PublishableEntity } from './coursables'

export class CourseEntity extends PublishableEntity<CourseFromModel> implements Publishable, Saleable {
	public readonly coursables: { id: string; type: Coursable }[]
	public readonly sections: CourseSection[]
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

	get pageLink() {
		return `/marketplace/${this.id}?type=course`
	}

	get shareLink() {
		return `${window.location.origin}${this.pageLink}`
	}

	get totalItems() {
		return this.sections.flatMap((section) => section.items.length).reduce((acc, cur) => acc + cur, 0)
	}
}
