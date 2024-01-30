import { FileFromModel } from '../../data/models/files'
import { CoursableData, FileType } from '../types'
import { CoursableEntity } from './coursables'
import { Media } from '@modules/core'

export class FileEntity extends CoursableEntity implements CoursableData {
	public readonly type: FileType
	public readonly media: Media

	constructor(data: FileFromModel) {
		super(data)
		this.type = data.type
		this.media = data.media
	}
}
