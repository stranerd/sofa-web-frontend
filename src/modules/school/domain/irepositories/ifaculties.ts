import { FacultyToModel } from '../../data/models/faculties'
import { FacultyEntity } from '../entities/faculties'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IFacultyRepository {
	add: (data: FacultyToModel) => Promise<FacultyEntity>
	get: (query: QueryParams) => Promise<QueryResults<FacultyEntity>>
	listenToOne: (id: string, listener: Listeners<FacultyEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listener: Listeners<FacultyEntity>,
		matches: (entity: FacultyEntity) => boolean,
	) => Promise<() => void>
	find: (id: string) => Promise<FacultyEntity | null>
	update: (id: string, data: FacultyToModel) => Promise<FacultyEntity>
	delete: (id: string) => Promise<void>
}
