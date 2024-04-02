import { NotificationData } from '../../domain/types'

export interface NotificationFromModel {
	id: string
	title: string
	body: string
	userId: string
	sendEmail: boolean
	data: NotificationData
	createdAt: number
	updatedAt: number
	seen: boolean
	link: string
}
