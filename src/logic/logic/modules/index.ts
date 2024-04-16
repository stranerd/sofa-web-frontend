import Common from './Common'
import Study from './Study'
import Screen from './Screen'

export const Logic = {
	Common: new Common(),
	Screen: new Screen(),
	Study: new Study(),
}

export type { Common, Screen }
