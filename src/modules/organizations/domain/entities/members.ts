import { MemberFromModel } from '../../data/models/members'
import { BaseEntity } from '@modules/core'

export class MemberEntity extends BaseEntity<MemberFromModel> {
	constructor(data: MemberFromModel) {
		super(data)
	}

	search(value: string) {
		if (!value) return true
		return [this.email, this.user?.bio.publicName ?? ''].some((field) => field.toLowerCase().includes(value.toLowerCase()))
	}
}
