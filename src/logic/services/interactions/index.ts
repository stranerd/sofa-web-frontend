import { ModelApiService } from '../common/ModelService'
import { TagEntity } from '@modules/interactions'
import { TagFromModel } from '@modules/interactions/data/models/tags'

export class TagsApi extends ModelApiService<TagFromModel, TagEntity> {
	constructor() {
		super('interactions/tags')
	}
	mapper = (data: TagFromModel) => new TagEntity(data)
}

export const InteractionApi = {
	tag: new TagsApi(),
}
