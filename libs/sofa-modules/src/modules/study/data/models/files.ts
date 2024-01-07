import { Media } from '@modules/core'
import { CoursableData, FileType } from '../../domain/types'

export interface FileFromModel extends FileToModel, CoursableData {
	id: string
	questions: string[]
	ratings: CoursableData['ratings']
	createdAt: number
	updatedAt: number
}

export interface FileToModel extends Omit<CoursableData, 'ratings' | 'user' | 'status'> {
	type: FileType
	media: Media
}
