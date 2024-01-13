import { AuthRepository } from './data/repositories/auth'
import { AuthUseCase } from './domain/usecases/auth'

export { AuthRoles, AuthTypes } from './domain/entities/auth'
export type { AfterAuthUser, AuthDetails, AuthRoleType, Phone, UserBio } from './domain/entities/auth'
export { EmailSigninFactory } from './domain/factories/emailSignin'
export { EmailSignupFactory } from './domain/factories/emailSignup'
export { PasswordResetFactory } from './domain/factories/passwordReset'
export { PasswordUpdateFactory } from './domain/factories/passwordUpdate'
export { PhoneUpdateFactory } from './domain/factories/phoneUpdate'
export { ProfileUpdateFactory } from './domain/factories/profileUpdate'

export const AuthUseCases = new AuthUseCase(AuthRepository.getInstance)
