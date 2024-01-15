import { ModelApiService } from '../common/ModelService'

export class ReviewsApi extends ModelApiService {
	constructor() {
		super('interactions/reviews')
	}
}

export class TagsApi extends ModelApiService {
	constructor() {
		super('interactions/tags')
	}
}

export const InteractionApi = {
	tag: new TagsApi(),
	reviews: new ReviewsApi(),
}
