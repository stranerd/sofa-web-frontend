import { FolderSaved } from '../../domain/types'

export interface FolderFromModel extends FolderToModel {
	id: string
	saved: Record<FolderSaved, string[]>
	createdAt: number
	updatedAt: number
}

export interface FolderToModel {
	title: string
}
