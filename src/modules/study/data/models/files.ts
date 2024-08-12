import { CoursableData, FileType } from '../../domain/types'
import { Media } from '@modules/core'

export interface FileFromModel extends FileToModel, CoursableData {
	id: string
	__type: 'FileEntity'
	type: FileType
	createdAt: number
	updatedAt: number
}

export interface FileToModel extends Omit<CoursableData, 'ratings' | 'topicId' | 'tagIds' | 'user' | 'status' | 'courseIds'> {
	topic: string
	tags: string[]
	media: Media
}
