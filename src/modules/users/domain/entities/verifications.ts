import { VerificationFromModel } from '../../data/models/verifications'
import { BaseEntity } from '@modules/core'

export class VerificationEntity extends BaseEntity<VerificationFromModel> {
	constructor(data: VerificationFromModel) {
		super(data)
	}
}
