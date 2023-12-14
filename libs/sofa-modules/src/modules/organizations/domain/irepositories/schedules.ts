import { QueryParams, QueryResults } from '@modules/core'
import { ScheduleToModel } from '../../data/models/schedules'
import { ScheduleEntity } from '../entities/schedules'

export interface IScheduleRepository {
	add: (data: ScheduleToModel) => Promise<ScheduleEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ScheduleEntity>>
	find: (id: string) => Promise<ScheduleEntity | null>
	update: (organizationId: string, classId: string, id: string, data: Partial<ScheduleToModel>) => Promise<ScheduleEntity | null>
	delete: (organizationId: string, classId: string, id: string) => Promise<boolean>
}