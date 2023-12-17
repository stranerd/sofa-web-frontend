import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { ScheduleToModel } from '../../data/models/schedules'
import { ScheduleEntity } from '../entities/schedules'

export interface IScheduleRepository {
	add: (data: ScheduleToModel) => Promise<ScheduleEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ScheduleEntity>>
	find: (id: string) => Promise<ScheduleEntity | null>
	update: (id: string, data: ScheduleToModel) => Promise<ScheduleEntity | null>
	delete: (id: string) => Promise<boolean>
	listenToOne: (id: string, listeners: Listeners<ScheduleEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listeners: Listeners<ScheduleEntity>, matches: (entity: ScheduleEntity) => boolean) => Promise<() => void>
}