import { UserRepository } from './data/repositories/users'
import { MetaMessageRepository } from './data/repositories/metaMessages'
import { UsersUseCase } from './domain/usecases/users'
import { MetaMessageUseCase } from './domain/usecases/metaMessage'

export const UsersUseCases = new UsersUseCase(UserRepository.getInstance)
export const MetaMessageUseCases = new MetaMessageUseCase(MetaMessageRepository.getInstance)

export { UserEntity } from './domain/entities/users'
export { UserAiFactory } from './domain/factories/userAi'
export { MetaMessageFactory } from './domain/factories/metaMessage'
export { UserLocationFactory } from './domain/factories/userLocation'
export { UserSocialsFactory } from './domain/factories/userSocials'
export { UserTypeFactory } from './domain/factories/userType'
export type { EmbeddedUser } from './domain/types'
export type { MetaMessageData } from './domain/types'
export { UserSocials, UserType, UserSchoolType } from './domain/types'
