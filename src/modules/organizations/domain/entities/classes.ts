import { ClassFromModel } from '../../data/models/classes'
import { ClassLesson, ClassMembers, EmbeddedUser, Saleable } from '../types'
import { BaseEntity, Media } from '@modules/core'
import { UserEntity } from '@modules/users'

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

	get pageLink() {
		return `/organizations/${this.organizationId}/classes/${this.id}`
	}

	get explorePageLink() {
		return `/organizations/${this.organizationId}/classes/${this.id}/explore`
	}

	get shareLink() {
		return `${window.location.origin}${this.explorePageLink}`
	}

	search(query: string) {
		return [this.title, this.description, ...this.lessons.map((l) => l.title)].some((text) =>
			text.toLowerCase().includes(query.toLowerCase()),
		)
	}

	isTeacher(userId: string) {
		return this.lessons.some((l) => l.users.teachers.includes(userId))
	}

	isStudent(userId: string) {
		return this.members.students.includes(userId) || this.lessons.some((l) => l.users.students.includes(userId))
	}

	isAdmin(userId: string) {
		return this.organizationId === userId
	}

	isEnrolled(user: UserEntity) {
		return (
			this.members.students.includes(user.id) ||
			this.lessons.some((l) => l.users.teachers.includes(user.id)) ||
			user.account.organizationsIn.some((org) => org.id === this.organizationId)
		)
	}

	getLesson(id: string) {
		return this.lessons.find((l) => l.id === id)
	}
}
