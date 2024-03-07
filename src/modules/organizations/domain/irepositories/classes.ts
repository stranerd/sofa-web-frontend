import { ClassToModel } from '../../data/models/classes'
import { ClassEntity } from '../entities/classes'
import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { SelectedPaymentMethod } from '@modules/payment'

export interface IClassRepository {
	add: (data: ClassToModel) => Promise<ClassEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ClassEntity>>
	explore: (condition: QueryParams) => Promise<QueryResults<ClassEntity>>
	find: (id: string) => Promise<ClassEntity | null>
	update: (id: string, data: ClassToModel) => Promise<ClassEntity>
	delete: (id: string) => Promise<boolean>
	listenToOne: (id: string, listeners: Listeners<ClassEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listeners: Listeners<ClassEntity>, matches: (entity: ClassEntity) => boolean) => Promise<() => void>
	purchase: (id: string, methodId: SelectedPaymentMethod) => Promise<boolean>
	cancelPurchase: (id: string) => Promise<boolean>
	similar: (id: string) => Promise<ClassEntity[]>
}
