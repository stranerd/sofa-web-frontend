import { MethodData } from '../../domain/types'
export interface MethodFromModel {
	id: string
	data: MethodData
	token: string
	primary: boolean
	userId: string
	createdAt: number
	updatedAt: number
}
