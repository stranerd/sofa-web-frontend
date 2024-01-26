import { Media } from '@modules/core'
import { CoursableData, FileType } from '../../domain/types'

export interface FileFromModel extends FileToModel, CoursableData {
	id: string
	type: FileType
	createdAt: number
	updatedAt: number
}

export interface FileToModel extends Omit<CoursableData, 'ratings' | 'topicId' | 'tagIds' | 'user' | 'status'> {
	topic: string
	tags: string[]
	media: Media
}
