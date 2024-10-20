import { FolderSaved } from '../../domain/types'
import { EmbeddedUser } from '@modules/users'

export interface FolderFromModel extends FolderToModel {
	id: string
	__type: 'FolderEntity'
	saved: Record<FolderSaved, string[]>
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}

export interface FolderToModel {
	title: string
}
