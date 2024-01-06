import { Media } from '@modules/core'
import { CoursableData, FileType } from '../../domain/types'

export interface FileFromModel extends FileToModel {
	id: string
	questions: string[]
	ratings: CoursableData['ratings']
	createdAt: number
	updatedAt: number
}

export interface FileToModel extends Omit<CoursableData, 'ratings'> {
	type: FileType
	media: Media
}
