import { MethodData } from '@modules/payment/domain/types'
export interface MethodFromModel extends MethodToModel {
	id: string
	token: string
	primary: boolean
	userId: string
	createdAt: number
	updatedAt: number
}

export interface MethodToModel {
	data: MethodData
}
