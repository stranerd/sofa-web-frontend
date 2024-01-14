import { FileEntity } from '@modules/study'
import { FileFromModel } from '@modules/study/data/models/files'
import { ModelApiService } from '../common/ModelService'

export default class FilesApi extends ModelApiService<FileFromModel, FileEntity> {
	constructor() {
		super('study/files')
	}

	mapper = (data: FileFromModel) => new FileEntity(data)
}
