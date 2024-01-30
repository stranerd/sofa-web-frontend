import { ModelApiService } from '../common/ModelService'
import { FileEntity } from '@modules/study'
import { FileFromModel } from '@modules/study/data/models/files'

export default class FilesApi extends ModelApiService<FileFromModel, FileEntity> {
	constructor() {
		super('study/files')
	}

	mapper = (data: FileFromModel) => new FileEntity(data)
}
