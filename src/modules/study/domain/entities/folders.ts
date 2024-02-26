import { FolderFromModel } from '../../data/models/folders'
import { BaseEntity } from '@modules/core'

export class FolderEntity extends BaseEntity<FolderFromModel> {
	constructor(data: FolderFromModel) {
		super(data)
	}
}
