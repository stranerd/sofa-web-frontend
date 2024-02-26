import { AnswerFromModel } from '../../data/models/answers'
import { BaseEntity } from '@modules/core'

export class AnswerEntity extends BaseEntity<AnswerFromModel> {
	constructor(data: AnswerFromModel) {
		super(data)
	}
}
