import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { FolderToModel } from '../../data/models/folders'
import { FolderEntity } from '../entities/folders'
import { FolderSaved } from '../types'

export interface IFolderRepository {
	add: (data: FolderToModel) => Promise<FolderEntity>
	get: (condition: QueryParams) => Promise<QueryResults<FolderEntity>>
	find: (id: string) => Promise<FolderEntity | null>
	update: (id: string, data: FolderToModel) => Promise<FolderEntity | null>
	delete: (id: string) => Promise<void>
	updateProp: (id: string, data: { type: FolderSaved; add: boolean; values: string[] }) => Promise<FolderEntity | null>
	listenToOne: (id: string, listener: Listeners<FolderEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<FolderEntity>, matches: (entity: FolderEntity) => boolean) => Promise<() => void>
}
