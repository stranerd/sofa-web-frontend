import { ScheduleToModel } from '../../data/models/schedules'
import { ScheduleEntity } from '../entities/schedules'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IScheduleRepository {
	add: (data: ScheduleToModel) => Promise<ScheduleEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ScheduleEntity>>
	find: (id: string) => Promise<ScheduleEntity | null>
	update: (id: string, data: ScheduleToModel) => Promise<ScheduleEntity>
	delete: (id: string) => Promise<boolean>
	start: (id: string) => Promise<boolean>
	end: (id: string) => Promise<boolean>
	listenToOne: (id: string, listeners: Listeners<ScheduleEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listeners: Listeners<ScheduleEntity>,
		matches: (entity: ScheduleEntity) => boolean,
	) => Promise<() => void>
}
