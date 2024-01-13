import { ModelApiService } from '../common/ModelService'

export default class ReviewsApi extends ModelApiService {
	constructor() {
		super('interactions/reviews')
	}
}
