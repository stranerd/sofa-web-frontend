import { Media } from '@modules/core'
import { CoursableData, FileType } from '../types'
import { CoursableEntity } from './coursables'

export class FileEntity extends CoursableEntity implements CoursableData {
	public readonly type: FileType
	public readonly media: Media

	constructor(data: FileConstructorArgs) {
		super(data)
		this.type = data.type
		this.media = data.media
	}
}

type FileConstructorArgs = CoursableData & {
	id: string
	type: FileType
	media: Media
	createdAt: number
	updatedAt: number
}
