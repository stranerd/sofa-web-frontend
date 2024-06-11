import { TutorRequestToModel } from '../../data/models/tutorRequests'
import { TutorRequestEntity } from '../entities/tutorRequests'
import { AcceptTutorRequestInput } from '../types'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface ITutorRequestRepository {
	find: (id: string) => Promise<TutorRequestEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<TutorRequestEntity>>
	listenToOne: (id: string, listener: Listeners<TutorRequestEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listener: Listeners<TutorRequestEntity>,
		matches: (entity: TutorRequestEntity) => boolean,
	) => Promise<() => void>
	accept: (id: string, data: AcceptTutorRequestInput) => Promise<TutorRequestEntity>
	create: (data: TutorRequestToModel) => Promise<TutorRequestEntity>
}
