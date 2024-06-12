import { VerificationToModel } from '../../data/models/verifications'
import { VerificationEntity } from '../entities/verifications'
import { AcceptVerificationInput } from '../types'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IVerificationRepository {
	find: (id: string) => Promise<VerificationEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<VerificationEntity>>
	listenToOne: (id: string, listener: Listeners<VerificationEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listener: Listeners<VerificationEntity>,
		matches: (entity: VerificationEntity) => boolean,
	) => Promise<() => void>
	accept: (id: string, data: AcceptVerificationInput) => Promise<VerificationEntity>
	create: (data: VerificationToModel) => Promise<VerificationEntity>
}
