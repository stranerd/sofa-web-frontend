import { FileFromModel } from '../../data/models/files'
import { CoursableData, FileType } from '../types'
import { CoursableEntity } from './coursables'
import { Media } from '@modules/core'
import { getTokens } from '@utils/tokens'
import { apiBase } from '@utils/environment'

export class FileEntity extends CoursableEntity implements CoursableData {
	public readonly type: FileType
	public readonly media: Media

	constructor(data: FileFromModel) {
		super(data)
		this.type = data.type
		this.media = data.media
	}

	async getMediaUrl() {
		const { accessToken } = await getTokens()
		return `${apiBase}/study/files/${this.id}/media?AccessToken=${accessToken}`
	}
}
