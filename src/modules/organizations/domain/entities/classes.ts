import { ClassFromModel } from '../../data/models/classes'
import { MemberTypes, Saleable } from '../types'
import { BaseEntity } from '@modules/core'
import { UserEntity } from '@modules/users'

export class ClassEntity extends BaseEntity<ClassFromModel> implements Saleable {
	constructor(data: ClassFromModel) {
		super(data)
	}

	get picture() {
		return this.photo?.link ?? '/images/default.svg'
	}

	get pageLink() {
		return `/organizations/${this.organizationId}/classes/${this.id}`
	}

	get shareLink() {
		return `${window.location.origin}${this.pageLink}`
	}

	get teachers() {
		return [...new Set(this.lessons.flatMap((l) => l.users.teachers))]
	}

	search(query: string) {
		return [this.title, this.description, ...this.lessons.map((l) => l.title)].some((text) =>
			text.toLowerCase().includes(query.toLowerCase()),
		)
	}

	isTeacher(user: UserEntity) {
		return this.lessons.some((l) => l.users.teachers.includes(user.id))
	}

	isStudent(user: UserEntity) {
		return this.members.students.includes(user.id)
	}

	isAdmin(user: UserEntity) {
		return this.organizationId === user.id
	}

	isEnrolled(user: UserEntity) {
		return this.isTeacher(user) || this.isStudent(user) || this.isAdmin(user)
	}

	getLesson(id: string) {
		return this.lessons.find((l) => l.id === id)
	}

	canAccessForFree(user: UserEntity) {
		return (
			this.isEnrolled(user) ||
			user.account.organizationsIn.some((o) => o.id === this.organizationId && o.type === MemberTypes.student)
		)
	}

	getTeacherStudents(id: string) {
		const lessons = this.lessons.filter((l) => l.users.teachers.includes(id))
		return [...new Set(lessons.flatMap((l) => l.users.students))]
	}

	getStudentTeachers(id: string) {
		const lessons = this.lessons.filter((l) => l.users.students.includes(id))
		return [...new Set(lessons.flatMap((l) => l.users.teachers))]
	}
}
