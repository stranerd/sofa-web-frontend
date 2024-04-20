import { v } from 'valleyed'
import { CommentToModel } from '../../data/models/comments'
import { CommentEntity } from '../entities/comments'
import { BaseFactory } from '@modules/core'

export class CommentFactory extends BaseFactory<CommentEntity, Omit<CommentToModel, 'entity'>, Omit<CommentToModel, 'entity'>> {
	readonly rules = {
		body: v.string().min(1),
	}

	reserved = []

	constructor() {
		super({ body: '' })
	}

	load = (entity: CommentEntity) => {
		this.body = entity.body
	}

	model = () => {
		const { body } = this.validValues
		return { body }
	}
}
