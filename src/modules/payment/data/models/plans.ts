import { Currencies, Interval, PlanData } from '../../domain/types'
import { UserType } from '@modules/users'

export interface PlanFromModel {
	id: string
	title: string
	amount: number
	active: boolean
	currency: Currencies
	interval: Interval
	data: PlanData
	usersFor: UserType[]
	createdAt: number
	updatedAt: number
}
