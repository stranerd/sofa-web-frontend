import { UserRepository } from './data/repositories/users'
import { UsersUseCase } from './domain/usecases/users'

export const UsersUseCases = new UsersUseCase(UserRepository.getInstance)

export { UserEntity } from './domain/entities/users'
export { UserAiFactory } from './domain/factories/userAi'
export { UserLocationFactory } from './domain/factories/userLocation'
export { UserSocialsFactory } from './domain/factories/userSocials'
export { UserTypeFactory } from './domain/factories/userType'
export type { EmbeddedUser } from './domain/types'
export { UserSocials, UserType } from './domain/types'
