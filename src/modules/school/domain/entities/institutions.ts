import { InstitutionFromModel } from '../../data/models/institutions'
import { BaseEntity } from '@modules/core'

export class InstitutionEntity extends BaseEntity<InstitutionFromModel> {
	constructor(data: InstitutionFromModel) {
		super(data)
	}
}
