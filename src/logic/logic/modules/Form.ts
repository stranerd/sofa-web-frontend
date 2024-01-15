import { FormRule } from '../types/common'

type State = {
	content: string
	updateValidationStatus: (val: boolean) => any
	updateErrorMessage: (val: string) => any
}

const isRequired = (state: State) => {
	if (state.content) state.updateValidationStatus(true)
	else {
		state.updateValidationStatus(false)
		state.updateErrorMessage('is required')
	}
}

export default class Form {
	public RequiredRule: FormRule = {
		type: 'isRequired',
		errorMessage: '',
		value: 0,
	}

	run(rules: FormRule[], state: State) {
		for (const rule of rules) {
			if (rule.type == 'isRequired') isRequired(state)
		}
	}
}
