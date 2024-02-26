import { ClassFromModel } from '../../data/models/classes'
import { MemberTypes, Saleable } from '../types'
import { BaseEntity } from '@modules/core'
import { UserEntity } from '@modules/users'

export class ClassEntity extends BaseEntity<ClassFromModel> implements Saleable {
	constructor(data: ClassFromModel) {
		super(data)
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

	isTeacher(user: UserEntity) {
		return (
			user.account.organizationsIn.some((o) => o.id === this.organizationId && o.type === MemberTypes.teacher) ||
			this.lessons.some((l) => l.users.teachers.includes(user.id))
		)
	}

	isStudent(user: UserEntity) {
		return (
			user.account.organizationsIn.some((o) => o.id === this.organizationId && o.type === MemberTypes.student) ||
			this.members.students.includes(user.id) ||
			this.lessons.some((l) => l.users.students.includes(user.id))
		)
	}

	isAdmin(user: UserEntity) {
		return this.organizationId === user.id
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
