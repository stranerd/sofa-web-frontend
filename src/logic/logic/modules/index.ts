import Common from './Common'
import Form from './Form'
import Study from './Study'
import Screen from './Screen'

export const Logic = {
	Common: new Common(),
	Screen: new Screen(),
	Form: new Form(),
	Study: new Study(),
}

export type { Common, Screen }
