import Common from './Common'
import Conversations from './Conversations'
import Form from './Form'
import Interactions from './Interactions'
import Notifications from './Notifications'
import Payment from './Payment'
import Plays from './Plays'
import Schools from './Schools'
import Study from './Study'
import Users from './Users'

import { valleyed } from '@utils/commons'

const study = new Study()

export const Logic = {
	...valleyed,
	Common: new Common(),
	Form: new Form(),
	Conversations: new Conversations(),
	Notifications: new Notifications(),
	Payment: new Payment(),
	Plays: new Plays(),
	Schools: new Schools(),
	Study: study,
	Users: new Users(),
	Interactions: new Interactions(),
}
