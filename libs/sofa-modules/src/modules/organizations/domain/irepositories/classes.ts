import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { ClassToModel } from '../../data/models/classes'
import { ClassEntity } from '../entities/classes'

export interface IClassRepository {
	add: (data: ClassToModel) => Promise<ClassEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ClassEntity>>
	find: (id: string) => Promise<ClassEntity | null>
	update: (id: string, data: ClassToModel) => Promise<ClassEntity | null>
	delete: (id: string) => Promise<boolean>
	listenToOne: (id: string, listeners: Listeners<ClassEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listeners: Listeners<ClassEntity>, matches: (entity: ClassEntity) => boolean) => Promise<() => void>
}