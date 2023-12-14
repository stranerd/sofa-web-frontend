import { UserRepository } from './data/repositories/users'
import { UsersUseCase } from './domain/usecases/users'

const userRepository = UserRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)

export { UserEntity } from './domain/entities/user'
export type { EmbeddedUser, UserType } from './domain/types'
