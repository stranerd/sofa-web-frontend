import MetaApi from './Meta'
import OrganizationApi from './OrganizationApi'
import TutorRequestApi from './TutorRequest'
import UsersApi from './UsersApi'
import VerificationsApi from './VerificationsApi'

export const UserApi = {
  users: new UsersApi(),
  verifications: new VerificationsApi(),
  organization: new OrganizationApi(),
  tutor_request: new TutorRequestApi(),
  meta: new MetaApi(),
}
