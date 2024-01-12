import { BaseEntity, Media } from '@modules/core'
import { ClassFromModel } from '../../data/models/classes'
import { ClassLesson, EmbeddedUser, Saleable } from '../types'

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
	public readonly createdAt: number
	public readonly updatedAt: number

	static defaultPhotoURL = '/images/default.png'

	constructor({ id, organizationId, title, description, photo, user, lessons, frozen, price, createdAt, updatedAt }: ClassFromModel) {
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
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get picture() {
		return this.photo?.link ?? '/images/default.png'
	}
}
