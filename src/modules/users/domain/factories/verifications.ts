import { v } from 'valleyed'
import { VerificationToModel } from '../../data/models/verifications'
import { VerificationEntity } from '../entities/verifications'
import { BaseFactory } from '@modules/core'

type Keys = Omit<VerificationToModel, 'content'> & VerificationToModel['content']

export class VerificationFactory extends BaseFactory<VerificationEntity, VerificationToModel, Keys> {
	readonly rules = {
		courses: v.array(v.string().min(1)).min(1).max(5),
		quizzes: v.array(v.string().min(1)).min(3).max(5),
	}
	reserved = []

	constructor() {
		super({ courses: [], quizzes: [] })
	}

	loadEntity = (entity: VerificationEntity) => {
		this.entityId = entity.id
		this.courses = entity.content.courses
		this.quizzes = entity.content.quizzes
	}

	model = async () => {
		const { courses, quizzes } = this.validValues
		return { content: { courses, quizzes } }
	}
}
