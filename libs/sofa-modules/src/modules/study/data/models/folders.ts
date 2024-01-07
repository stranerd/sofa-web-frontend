import { EmbeddedUser } from '@modules/users'
import { FolderSaved } from '../../domain/types'

export interface FolderFromModel extends FolderToModel {
	id: string
	saved: Record<FolderSaved, string[]>
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}

export interface FolderToModel {
	title: string
}
