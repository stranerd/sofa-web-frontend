import { TagFromModel } from '../../data/models/tags'
import { BaseEntity } from '@modules/core'

export class TagEntity extends BaseEntity<TagFromModel> {
	constructor(data: TagFromModel) {
		super(data)
	}
}
