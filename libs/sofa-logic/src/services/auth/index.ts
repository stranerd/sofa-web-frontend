import IdentitiesApi from './IdentitiesApi'
import PasswordsApi from './PasswordsApi'
import PhoneApi from './PhoneApi'
import UserApi from './UserApi'

export const AuthApi = {
	identities: new IdentitiesApi(),
	passwords: new PasswordsApi(),
	phone: new PhoneApi(),
	user: new UserApi(),
}
