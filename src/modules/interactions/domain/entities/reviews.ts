import { ReviewFromModel } from '../../data/models/reviews'
import { BaseEntity } from '@modules/core'

export class ReviewEntity extends BaseEntity<ReviewFromModel> {
	constructor(data: ReviewFromModel) {
		super(data)
	}
}
