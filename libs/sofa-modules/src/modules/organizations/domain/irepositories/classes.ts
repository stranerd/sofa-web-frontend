import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { ClassToModel } from '../../data/models/classes'
import { ClassEntity } from '../entities/classes'

export interface IClassRepository {
	add: (data: ClassToModel) => Promise<ClassEntity>
	get: (organizationId: string, condition: QueryParams) => Promise<QueryResults<ClassEntity>>
	find: (organizationId: string, id: string) => Promise<ClassEntity | null>
	update: (organizationId: string, id: string, data: ClassToModel) => Promise<ClassEntity | null>
	delete: (organizationId: string, id: string) => Promise<boolean>
	listenToOne: (organizationId: string, id: string, listeners: Listeners<ClassEntity>) => Promise<() => void>
	listenToMany: (organizationId: string, query: QueryParams, listeners: Listeners<ClassEntity>, matches: (entity: ClassEntity) => boolean) => Promise<() => void>
}