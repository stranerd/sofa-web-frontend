import { LikeFromModel } from '../../data/models/likes'
import { BaseEntity } from '@modules/core'

export class LikeEntity extends BaseEntity<LikeFromModel> {
	constructor(data: LikeFromModel) {
		super(data)
	}
}
