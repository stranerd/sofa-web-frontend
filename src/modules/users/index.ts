import { MetaMessageRepository } from './data/repositories/metaMessages'
import { TutorRequestRepository } from './data/repositories/tutorRequests'
import { UserRepository } from './data/repositories/users'
import { VerificationRepository } from './data/repositories/verifications'
import { MetaMessageUseCase } from './domain/usecases/metaMessage'
import { TutorRequestsUseCase } from './domain/usecases/tutorRequests'
import { UsersUseCase } from './domain/usecases/users'
import { VerificationsUseCase } from './domain/usecases/verifications'

export const UsersUseCases = new UsersUseCase(UserRepository.getInstance)
export const VerificationsUseCases = new VerificationsUseCase(VerificationRepository.getInstance)
export const TutorRequestsUseCases = new TutorRequestsUseCase(TutorRequestRepository.getInstance)
export const MetaMessageUseCases = new MetaMessageUseCase(MetaMessageRepository.getInstance)

export { UserEntity } from './domain/entities/users'
export { MetaMessageFactory } from './domain/factories/metaMessage'
export { TutorRequestFactory } from './domain/factories/tutorRequests'
export { UserAiFactory } from './domain/factories/userAi'
export { UserLocationFactory } from './domain/factories/userLocation'
export { UserSocialsFactory } from './domain/factories/userSocials'
export { UserTypeFactory } from './domain/factories/userType'
export { VerificationFactory } from './domain/factories/verifications'
export { UserSchoolType, UserSocials, UserType } from './domain/types'
export type { EmbeddedUser, MetaMessageData } from './domain/types'
