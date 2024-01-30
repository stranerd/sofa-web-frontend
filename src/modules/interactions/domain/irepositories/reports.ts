import { ReportToModel } from '../../data/models/reports'
import { ReportEntity } from '../entities/reports'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IReportRepository {
	add: (data: ReportToModel) => Promise<ReportEntity>
	get: (query: QueryParams) => Promise<QueryResults<ReportEntity>>
	listenToOne: (id: string, listener: Listeners<ReportEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<ReportEntity>, matches: (entity: ReportEntity) => boolean) => Promise<() => void>
	find: (id: string) => Promise<ReportEntity | null>
	delete: (id: string) => Promise<void>
}
