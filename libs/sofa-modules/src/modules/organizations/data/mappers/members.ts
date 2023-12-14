import { MemberEntity } from '../../domain/entities/members'
import { MemberFromModel, MemberToModel } from '../models/members'

export class MemberMapper {
	mapFrom (param: MemberFromModel | null) {
		return !param ? null : new MemberEntity({
			id: param._id.toString(),
			email: param.email,
			user: param.user,
			type: param.type,
			organizationId: param.organizationId,
			pending: param.pending,
			withCode: param.withCode,
			accepted: param.accepted,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: MemberEntity) : MemberToModel  {
		return {
			email: param.email,
			type: param.type,
			organizationId: param.organizationId,
		}
	}
}