import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { FileToModel } from '../../data/models/files'
import { FileEntity } from '../entities/files'

export interface IFileRepository {
	add: (data: FileToModel) => Promise<FileEntity>
	get: (condition: QueryParams) => Promise<QueryResults<FileEntity>>
	find: (id: string) => Promise<FileEntity | null>
	update: (id: string, data: FileToModel) => Promise<FileEntity>
	delete: (id: string) => Promise<void>
	publish: (id: string) => Promise<FileEntity | null>
	listenToOne: (id: string, listener: Listeners<FileEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<FileEntity>, matches: (entity: FileEntity) => boolean) => Promise<() => void>
}
