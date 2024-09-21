import { v } from 'valleyed'
import { UserEntity } from '../entities/users'
import { UserSchool, UserSchoolType, UserType, UserTypeData } from '../types'
import { BaseFactory } from '@modules/core'

type Exam = {
	institutionId: string
	courseIds: string[]
}

type Keys = {
	type: UserType
	schoolType: UserSchoolType
	institutionId: string
	facultyId: string
	departmentId: string
	exams: Exam[]

	opLength: string
	sellsMaterials: boolean

	degree: string
	workplace: string

	name: string
	code: string
	teachersSize: string
	studentsSize: string
}

export class UserTypeFactory extends BaseFactory<UserEntity, UserTypeData, Keys> {
	readonly rules = {
		type: v.in(Object.values(UserType)).custom((val) => val !== UserType.agent, 'agent type is not allowed for now'),

		schoolType: v
			.in(Object.values(UserSchoolType))
			.requiredIf(() => this.canSetSchool)
			.custom(
				(val) => (this.isTeacher || this.isOrganization ? val === UserSchoolType.aspirant : true),
				'only aspirants level is supported for orgs and teachers',
			),

		institutionId: v
			.string()
			.min(1)
			.requiredIf(() => this.canSetSchool && this.isCollegeType),
		facultyId: v
			.string()
			.min(1)
			.requiredIf(() => this.canSetSchool && this.isCollegeType),
		departmentId: v
			.string()
			.min(1)
			.requiredIf(() => this.canSetSchool && this.isCollegeType),

		exams: v
			.array(
				v.any().addRule((val: any) =>
					v
						.object({
							institutionId: v.string().min(1),
							courseIds: v.array(v.string().min(1)).min(1),
						})
						.parse(val),
				),
			)
			.requiredIf(() => this.canSetSchool && this.isAspirantType),

		opLength: v
			.string()
			.min(1)
			.requiredIf(() => this.isTeacher || this.isOrganization),
		sellsMaterials: v.boolean().requiredIf(() => this.isTeacher || this.isOrganization),

		degree: v
			.string()
			.min(1)
			.requiredIf(() => this.isTeacher),
		workplace: v
			.string()
			.min(1)
			.requiredIf(() => this.isTeacher),

		name: v
			.string()
			.min(1)
			.requiredIf(() => this.isOrganization),
		code: v
			.string()
			.min(6)
			.requiredIf(() => this.isOrganization),
		teachersSize: v
			.string()
			.min(1)
			.requiredIf(() => this.isOrganization),
		studentsSize: v
			.string()
			.min(1)
			.requiredIf(() => this.isOrganization),
	}
	reserved = ['type']
	protected onSet = {
		type: () => {
			this.resetProp('schoolType')
		},
		institutionId: () => {
			this.resetProp('facultyId')
			this.resetProp('departmentId')
		},
		facultyId: () => {
			this.resetProp('departmentId')
		},
	}

	constructor() {
		super({
			type: UserType.student,
			schoolType: UserSchoolType.aspirant,
			institutionId: '',
			facultyId: '',
			departmentId: '',
			exams: [],
			opLength: '',
			sellsMaterials: false,
			degree: '',
			workplace: '',
			name: '',
			code: '',
			teachersSize: '',
			studentsSize: '',
		})
	}

	get institutions() {
		return this.exams.map((e, i) => ({
			...e,
			toggleCourse: (courseId: string) => {
				const index = e.courseIds.indexOf(courseId)
				const courseIds = index === -1 ? [...e.courseIds, courseId] : e.courseIds.filter((c) => c !== courseId)
				this.exams = this.exams.map((e, j) => (i === j ? { ...e, courseIds } : e))
			},
		}))
	}

	hasInstitution(institutionId: string) {
		return this.exams.some((e) => e.institutionId === institutionId)
	}

	toggleInstitution(institutionId: string) {
		const index = this.exams.findIndex((e) => e.institutionId === institutionId)
		this.exams =
			index === -1 ? [...this.exams, { institutionId, courseIds: [] }] : this.exams.filter((e) => e.institutionId !== institutionId)
	}

	get isStudent() {
		return this.type === UserType.student
	}

	get isTeacher() {
		return this.type === UserType.teacher
	}

	get isOrganization() {
		return this.type === UserType.organization
	}

	get isAgent() {
		return this.type === UserType.agent
	}

	get canSetSchool() {
		return this.isStudent || this.isTeacher || this.isOrganization
	}

	get isCollegeType() {
		return this.schoolType === UserSchoolType.college
	}

	get isAspirantType() {
		return this.schoolType === UserSchoolType.aspirant
	}

	get isGraduateType() {
		return this.schoolType === UserSchoolType.graduate
	}

	load = (entity: UserEntity) => {
		this.entityId = entity.id
		if (!entity.type) return
		this.type = entity.type.type
		if ('school' in entity.type && entity.type.school) {
			const school = entity.type.school
			this.schoolType = school.type
			if (school.type === UserSchoolType.college) {
				this.institutionId = school.institutionId
				this.facultyId = school.facultyId
				this.departmentId = school.departmentId
			} else if (school.type === UserSchoolType.aspirant) {
				this.exams = school.exams
			}
		}
		if ('opLength' in entity.type) this.opLength = entity.type.opLength
		if ('sellsMaterials' in entity.type) this.sellsMaterials = entity.type.sellsMaterials

		if (entity.type.type === UserType.student) {
		} else if (entity.type.type === UserType.teacher) {
			this.degree = entity.type.degree ?? ''
			this.workplace = entity.type.workplace ?? ''
		} else if (entity.type.type === UserType.organization) {
			this.name = entity.type.name
			this.code = entity.type.code ?? ''
			this.teachersSize = entity.type.teachersSize ?? ''
			this.studentsSize = entity.type.studentsSize ?? ''
		}
	}

	model = (): UserTypeData => {
		const {
			type,
			schoolType,
			institutionId,
			facultyId,
			departmentId,
			exams,
			opLength,
			sellsMaterials,
			degree,
			workplace,
			name,
			code,
			teachersSize,
			studentsSize,
		} = this.validValues
		const school: UserSchool =
			schoolType === UserSchoolType.college
				? {
						type: UserSchoolType.college,
						institutionId,
						facultyId,
						departmentId,
					}
				: schoolType === UserSchoolType.aspirant
					? {
							type: UserSchoolType.aspirant,
							exams,
						}
					: {
							type: UserSchoolType.graduate,
						}
		if (type === UserType.agent) return { type: UserType.agent }
		else if (type === UserType.student) return { type: UserType.student, school }
		else if (type === UserType.teacher) return { type: UserType.teacher, school, opLength, sellsMaterials, degree, workplace }
		else if (type === UserType.organization)
			return { type: UserType.organization, school, opLength, sellsMaterials, name, code, teachersSize, studentsSize }
		throw new Error(`Invalid user type: ${type}`)
	}
}
