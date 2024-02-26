import { MethodFromModel } from '../../data/models/methods'
import { BaseEntity } from '@modules/core'

export class MethodEntity extends BaseEntity<MethodFromModel> {
	constructor(data: MethodFromModel) {
		super(data)
	}
}
