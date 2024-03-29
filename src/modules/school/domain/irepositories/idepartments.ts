import { DepartmentToModel } from '../../data/models/departments'
import { DepartmentEntity } from '../entities/departments'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IDepartmentRepository {
	add: (data: DepartmentToModel) => Promise<DepartmentEntity>
	get: (query: QueryParams) => Promise<QueryResults<DepartmentEntity>>
	listenToOne: (id: string, listener: Listeners<DepartmentEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listener: Listeners<DepartmentEntity>,
		matches: (entity: DepartmentEntity) => boolean,
	) => Promise<() => void>
	find: (id: string) => Promise<DepartmentEntity | null>
	update: (id: string, data: DepartmentToModel) => Promise<DepartmentEntity>
	delete: (id: string) => Promise<void>
}
