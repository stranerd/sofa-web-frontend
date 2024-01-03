import { FormRule } from '../types/common'

export default class Form {
	constructor() {
		// initiate things here
	}

	public RequiredRule: FormRule = {
		type: 'isRequired',
		errorMessage: '',
		value: 0,
	}
}
