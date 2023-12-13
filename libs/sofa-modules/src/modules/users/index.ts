import { UserApiDataSource } from './data/datasources/userApi'
import { UserRepository } from './data/repositories/user'
import { UserTransformer } from './data/transformers/user'
import { UsersUseCase } from './domain/usecases/users'

const userDataSource = new UserApiDataSource()

const userTransformer = new UserTransformer()

const userRepository = new UserRepository(userDataSource, userTransformer)

export const UsersUseCases = new UsersUseCase(userRepository)

export { UserEntity} from './domain/entities/user'
export type { EmbeddedUser, UserType } from './domain/types'
