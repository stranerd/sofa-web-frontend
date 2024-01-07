import { BaseEntity } from '@modules/core'
import { CoursableData, DraftStatus, Publishable } from '../types'

export class PublishableEntity extends BaseEntity implements Publishable {
	public readonly id: string
	public readonly title: Publishable['title']
	public readonly description: Publishable['description']
	public readonly photo: Publishable['photo']
	public readonly user: Publishable['user']
	public readonly topicId: Publishable['topicId']
	public readonly tagIds: Publishable['tagIds']
	public readonly status: Publishable['status']
	public readonly ratings: Publishable['ratings']
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({
		id,
		title,
		description,
		photo,
		user,
		topicId,
		tagIds,
		ratings,
		status,
		createdAt,
		updatedAt,
	}: PublishableConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.description = description
		this.photo = photo
		this.user = user
		this.topicId = topicId
		this.tagIds = tagIds
		this.ratings = ratings
		this.status = status
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get isPublished() {
		return this.status === DraftStatus.published
	}

	get isDraft() {
		return this.status === DraftStatus.draft
	}
}

type PublishableConstructorArgs = Publishable & {
	id: string
	createdAt: number
	updatedAt: number
}

export class CoursableEntity extends PublishableEntity implements CoursableData {
	public readonly courseId: string | null

	constructor(data: PublishableConstructorArgs & { courseId: string | null }) {
		super(data)
		this.courseId = data.courseId
	}
}
