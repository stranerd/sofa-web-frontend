import { BaseEntity, Media } from '@modules/core'
import { ClassFromModel } from '../../data/models/classes'
import { ClassLesson, ClassMembers, EmbeddedUser, Saleable } from '../types'

export class ClassEntity extends BaseEntity implements Saleable {
	public readonly id: string
	public readonly organizationId: string
	public readonly title: string
	public readonly description: string
	public readonly photo: Media | null
	public readonly user: EmbeddedUser
	public readonly frozen: Saleable['frozen']
	public readonly price: Saleable['price']
	public readonly lessons: ClassLesson[]
	public readonly members: ClassMembers
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({
		id,
		organizationId,
		title,
		description,
		photo,
		user,
		lessons,
		members,
		frozen,
		price,
		createdAt,
		updatedAt,
	}: ClassFromModel) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.title = title
		this.description = description
		this.photo = photo
		this.user = user
		this.frozen = frozen
		this.price = price
		this.lessons = lessons
		this.members = members
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get picture() {
		return this.photo?.link ?? '/images/default.png'
	}

	get shareLink() {
		return `${window.location.origin}/organizations/${this.organizationId}/classes/${this.id}`
	}

	search(query: string) {
		return [this.title, this.description, ...this.lessons.map((l) => l.title)].some((text) =>
			text.toLowerCase().includes(query.toLowerCase()),
		)
	}
}
