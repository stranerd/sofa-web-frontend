import { ReadOnlyApiService } from '../common/ReadOnlyService'

export default class PlansApi extends ReadOnlyApiService {
	constructor() {
		super('payment/plans')
	}
}
