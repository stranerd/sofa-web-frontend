import { FileFromModel } from '../../data/models/files'
import { CoursableAccess, FileType } from '../types'
import { CoursableEntity } from './coursables'
import { Media } from '@modules/core'
import { apiBase } from '@utils/environment'
import { getTokens } from '@utils/tokens'

export class FileEntity extends CoursableEntity {
	public readonly type: FileType
	public readonly media: Media

	constructor(data: FileFromModel) {
		super(data)
		this.type = data.type
		this.media = data.media
	}

	async getUrl(access?: CoursableAccess['access']) {
		const { accessToken } = await getTokens()
		const query = new URLSearchParams({
			AccessToken: JSON.stringify(accessToken ?? ''),
			access: JSON.stringify(access ?? {}),
		})
		return `${apiBase}/study/files/${this.id}/media?${query.toString()}`
	}
}
