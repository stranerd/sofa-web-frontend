import { v } from 'valleyed'
import { reactive } from 'vue'
import { UserEntity } from '../entities/users'
import { UserSchoolType, UserType, UserTypeData } from '../types'
import { BaseFactory } from '@modules/core'

type Exam = {
	institutionId: string
	courseIds: string[]
	startDate: number
	endDate: number
}

type Keys = {
	type: UserType
	schoolType: UserSchoolType
	institutionId: string
	facultyId: string
	departmentId: string
	exams: Exam[]
	school: string
	name: string
	code: string
}

export class UserTypeFactory extends BaseFactory<UserEntity, UserTypeData, Keys> {
	readonly rules = {
		type: v.in(Object.values(UserType)),

		schoolType: v.in(Object.values(UserSchoolType)).requiredIf(() => this.isStudent),

		institutionId: v
			.string()
			.min(1)
			.requiredIf(() => this.isStudent && this.isCollegeType),
		facultyId: v
			.string()
			.min(1)
			.requiredIf(() => this.isStudent && this.isCollegeType),
		departmentId: v
			.string()
			.min(1)
			.requiredIf(() => this.isStudent && this.isCollegeType),

		exams: v
			.array(
				v.any().addRule((val: any) =>
					v
						.object({
							institutionId: v.string().min(1),
							courseIds: v.array(v.string().min(1)).min(1),
							startDate: v.time().asStamp(),
							endDate: v.time().min(val?.start).asStamp(),
						})
						.parse(val),
				),
			)
			.requiredIf(() => this.isStudent && this.isAspirantType),

		school: v
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
	}
	reserved = ['type']
	extras = reactive({
		insts: [] as string[],
		activeInst: null as string | null,
	})
	protected onSet = {
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
			schoolType: UserSchoolType.university,
			institutionId: '',
			facultyId: '',
			departmentId: '',
			exams: [],
			school: '',
			name: '',
			code: '',
		})
	}

	get institutions() {
		return this.extras.insts
	}

	set institutions(institutionIds: string[]) {
		const now = Date.now()
		this.exams = institutionIds.map((institutionId) => ({
			institutionId,
			courseIds: [],
			startDate: now,
			endDate: now,
			...(this.exams.find((e) => e.institutionId === institutionId) ?? {}),
		}))
		this.institutions.splice(0, this.institutions.length, ...this.exams.map((e) => e.institutionId))
		if (this.activeInst && !this.institutions.includes(this.activeInst)) this.activeInst = null
	}

	get activeInst() {
		return this.extras.activeInst
	}

	set activeInst(institutionId: string | null) {
		this.extras.activeInst = institutionId
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

	get isCollegeType() {
		return this.schoolType === UserSchoolType.college
	}

	get isAspirantType() {
		return this.schoolType === UserSchoolType.aspirant
	}

	get isUniversityType() {
		return this.schoolType === UserSchoolType.university
	}

	getInstitution(institutionId: string) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const classThis = this
		const obj = this.exams.find((e) => e.institutionId === institutionId)!
		return {
			...obj,
			get courseIds() {
				return obj.courseIds
			},
			set courseIds(value: string[]) {
				obj.courseIds = value
				// eslint-disable-next-line no-self-assign
				classThis.exams = classThis.exams
			},
			get startTime() {
				return new Date(obj.startDate).toISOString().substring(0, 10)
			},
			set startTime(value: string) {
				obj.startDate = new Date(value).getTime()
				// eslint-disable-next-line no-self-assign
				classThis.exams = classThis.exams
			},
			get endTime() {
				return new Date(obj.endDate).toISOString().substring(0, 10)
			},
			set endTime(value: string) {
				obj.endDate = new Date(value).getTime()
				// eslint-disable-next-line no-self-assign
				classThis.exams = classThis.exams
			},
		}
	}

	loadEntity = (entity: UserEntity) => {
		this.entityId = entity.id
		if (!entity.type) return
		this.type = entity.type.type
		if (entity.type.type === UserType.student) {
			if (entity.type.school.type === UserSchoolType.college) {
				this.institutionId = entity.type.school.institutionId
				this.facultyId = entity.type.school.facultyId
				this.departmentId = entity.type.school.departmentId
			} else if (entity.type.school.type === UserSchoolType.aspirant) {
				this.set('exams', entity.type.school.exams)
				this.institutions = entity.type.school.exams.map((e) => e.institutionId)
			}
		} else if (entity.type.type === UserType.teacher) {
			this.school = entity.type.school
		} else if (entity.type.type === UserType.organization) {
			this.name = entity.type.name
			this.code = entity.type.code
		}
	}

	model = async (): Promise<UserTypeData> => {
		const { institutionId, facultyId, departmentId, exams, school, name, code } = this.validValues
		if (this.isTeacher) return { type: UserType.teacher, school }
		if (this.isOrganization) return { type: UserType.organization, name, code }
		return {
			type: UserType.student,
			school: this.isCollegeType
				? {
						type: UserSchoolType.college,
						institutionId,
						facultyId,
						departmentId,
					}
				: this.isAspirantType
					? {
							type: UserSchoolType.aspirant,
							exams,
						}
					: {
							type: UserSchoolType.university,
						},
		}
	}
}
