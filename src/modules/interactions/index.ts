import { CommentRepository } from './data/repositories/comments'
import { LikeRepository } from './data/repositories/likes'
import { TagRepository } from './data/repositories/tags'
import { ViewRepository } from './data/repositories/views'
import { CommentEntity } from './domain/entities/comments'
import { LikeEntity } from './domain/entities/likes'
import { TagEntity } from './domain/entities/tags'
import { ViewEntity } from './domain/entities/views'
import { CommentFactory } from './domain/factories/comments'
import { TagFactory } from './domain/factories/tags'
import { InteractionEntities, TagTypes } from './domain/types'
import { CommentsUseCase } from './domain/usecases/comments'
import { LikesUseCase } from './domain/usecases/likes'
import { TagsUseCase } from './domain/usecases/tags'
import { ViewsUseCase } from './domain/usecases/views'

export const CommentsUseCases = new CommentsUseCase(CommentRepository.getInstance)
export const LikesUseCases = new LikesUseCase(LikeRepository.getInstance)
export const ViewsUseCases = new ViewsUseCase(ViewRepository.getInstance)
export const TagsUseCases = new TagsUseCase(TagRepository.getInstance)

export { CommentEntity, CommentFactory, InteractionEntities, LikeEntity, TagEntity, TagFactory, TagTypes, ViewEntity }
