import { UserRepository } from './data/repositories/users'
import { UsersUseCase } from './domain/usecases/users'

export const UsersUseCases = new UsersUseCase(UserRepository.getInstance)

export { UserEntity } from './domain/entities/users'
export type { EmbeddedUser, UserType } from './domain/types'
