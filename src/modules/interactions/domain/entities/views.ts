import { ViewFromModel } from '../../data/models/views'
import { BaseEntity } from '@modules/core'

export class ViewEntity extends BaseEntity<ViewFromModel> {
	constructor(data: ViewFromModel) {
		super(data)
	}
}
