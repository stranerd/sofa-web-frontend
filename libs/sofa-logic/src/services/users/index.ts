import MetaApi from './Meta'
import TutorRequestApi from './TutorRequest'
import UsersApi from './UsersApi'
import VerificationsApi from './VerificationsApi'

export const UserApi = {
	users: new UsersApi(),
	verifications: new VerificationsApi(),
	tutor_request: new TutorRequestApi(),
	meta: new MetaApi(),
}
