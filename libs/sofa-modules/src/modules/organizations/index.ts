import { AnnouncementRepository } from './data/repositories/announcements'
import { ClassRepository } from './data/repositories/classes'
import { LessonRepository } from './data/repositories/lessons'
import { MemberRepository } from './data/repositories/members'
import { ScheduleRepository } from './data/repositories/schedules'
import { AnnouncementsUseCase } from './domain/useCases/announcements'
import { ClassesUseCase } from './domain/useCases/classes'
import { LessonsUseCase } from './domain/useCases/lessons'
import { MembersUseCase } from './domain/useCases/members'
import { SchedulesUseCase } from './domain/useCases/schedules'

export const AnnouncementsUseCases = new AnnouncementsUseCase(AnnouncementRepository.getInstance)
export const ClassesUseCases = new ClassesUseCase(ClassRepository.getInstance)
export const LessonsUseCases = new LessonsUseCase(LessonRepository.getInstance)
export const MembersUseCases = new MembersUseCase(MemberRepository.getInstance)
export const SchedulesUseCases = new SchedulesUseCase(ScheduleRepository.getInstance)

export { AnnouncementEntity } from './domain/entities/announcements'
export { ClassEntity } from './domain/entities/classes'
export { LessonEntity } from './domain/entities/lessons'
export { MemberEntity } from './domain/entities/members'
export { ScheduleEntity } from './domain/entities/schedules'
export { MemberTypes } from './domain/types'
