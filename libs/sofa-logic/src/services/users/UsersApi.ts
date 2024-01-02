import { ReadOnlyApiService } from '../common/ReadOnlyService'

export default class UsersApi extends ReadOnlyApiService {
	constructor() {
		super('users/users')
	}
}
