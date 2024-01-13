import MetaApi from './Meta'
import TutorRequestApi from './TutorRequest'
import VerificationsApi from './VerificationsApi'

export const UserApi = {
	verifications: new VerificationsApi(),
	tutor_request: new TutorRequestApi(),
	meta: new MetaApi(),
}
