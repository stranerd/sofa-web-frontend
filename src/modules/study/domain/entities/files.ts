import { FileFromModel } from '../../data/models/files'
import { CoursableAccess } from '../types'
import { CoursableEntity } from './coursables'
import { getTokens } from '@utils/tokens'
import { apiBase } from '@utils/environment'

export class FileEntity extends CoursableEntity<FileFromModel> {
	constructor(data: FileFromModel) {
		super(data)
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
