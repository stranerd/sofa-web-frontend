import { CommentRepository } from './data/repositories/comments'
import { LikeRepository } from './data/repositories/likes'
import { ReportRepository } from './data/repositories/reports'
import { ReviewRepository } from './data/repositories/reviews'
import { TagRepository } from './data/repositories/tags'
import { ViewRepository } from './data/repositories/views'
import { CommentsUseCase } from './domain/usecases/comments'
import { LikesUseCase } from './domain/usecases/likes'
import { ReportsUseCase } from './domain/usecases/reports'
import { ReviewsUseCase } from './domain/usecases/reviews'
import { TagsUseCase } from './domain/usecases/tags'
import { ViewsUseCase } from './domain/usecases/views'

export const CommentsUseCases = new CommentsUseCase(CommentRepository.getInstance)
export const LikesUseCases = new LikesUseCase(LikeRepository.getInstance)
export const ReportsUseCases = new ReportsUseCase(ReportRepository.getInstance)
export const ReviewsUseCases = new ReviewsUseCase(ReviewRepository.getInstance)
export const TagsUseCases = new TagsUseCase(TagRepository.getInstance)
export const ViewsUseCases = new ViewsUseCase(ViewRepository.getInstance)

export { CommentEntity } from './domain/entities/comments'
export { LikeEntity } from './domain/entities/likes'
export { ReportEntity } from './domain/entities/reports'
export { ReviewEntity } from './domain/entities/reviews'
export { TagEntity } from './domain/entities/tags'
export { ViewEntity } from './domain/entities/views'
export { CommentFactory } from './domain/factories/comments'
export { ReportFactory } from './domain/factories/reports'
export { ReviewFactory } from './domain/factories/reviews'
export { TagFactory } from './domain/factories/tags'
export { InteractionEntities, TagTypes } from './domain/types'
export type { Interaction, InteractionEntity } from './domain/types'
