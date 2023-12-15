import { BaseEntity, Media } from '@modules/core'
import { ClassFromModel } from '../../data/models/classes'
import { EmbeddedUser, Saleable } from '../types'

export class ClassEntity extends BaseEntity implements Saleable {
	public readonly id: string
	public readonly organizationId: string
	public readonly title: string
	public readonly description: string
	public readonly photo: Media | null
	public readonly user: EmbeddedUser
	public readonly frozen: Saleable['frozen']
	public readonly price: Saleable['price']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, organizationId, title, description, photo, user, frozen, price, createdAt, updatedAt }: ClassFromModel) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.title = title
		this.description = description
		this.photo = photo
		this.user = user
		this.frozen = frozen
		this.price = price
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}