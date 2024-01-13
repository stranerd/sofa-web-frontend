import Common from './Common'
import Form from './Form'
import Interactions from './Interactions'
import Notifications from './Notifications'
import Payment from './Payment'
import Plays from './Plays'
import Study from './Study'
import Users from './Users'

import { valleyed } from '@utils/commons'

const study = new Study()

export const Logic = {
	...valleyed,
	Common: new Common(),
	Form: new Form(),
	Notifications: new Notifications(),
	Payment: new Payment(),
	Plays: new Plays(),
	Study: study,
	Users: new Users(),
	Interactions: new Interactions(),
}
