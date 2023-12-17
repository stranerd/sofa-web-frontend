import PasswordsApi from './PasswordsApi'
import PhoneApi from './PhoneApi'
import UserApi from './UserApi'

export const AuthApi = {
	passwords: new PasswordsApi(),
	phone: new PhoneApi(),
	user: new UserApi(),
}
