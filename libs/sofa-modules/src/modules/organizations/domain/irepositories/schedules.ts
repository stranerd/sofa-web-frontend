import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { ScheduleToModel } from '../../data/models/schedules'
import { ScheduleEntity } from '../entities/schedules'

export interface IScheduleRepository {
	add: (data: ScheduleToModel) => Promise<ScheduleEntity>
	get: (organizationId: string, classId: string, condition: QueryParams) => Promise<QueryResults<ScheduleEntity>>
	find: (organizationId: string, classId: string, id: string) => Promise<ScheduleEntity | null>
	update: (organizationId: string, classId: string, id: string, data: ScheduleToModel) => Promise<ScheduleEntity | null>
	delete: (organizationId: string, classId: string, id: string) => Promise<boolean>
	listenToOne: (organizationId: string, classId: string, id: string, listeners: Listeners<ScheduleEntity>) => Promise<() => void>
	listenToMany: (organizationId: string, classId: string, query: QueryParams, listeners: Listeners<ScheduleEntity>, matches: (entity: ScheduleEntity) => boolean) => Promise<() => void>
}