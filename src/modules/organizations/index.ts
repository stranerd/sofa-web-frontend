import { AnnouncementRepository } from './data/repositories/announcements'
import { ClassRepository } from './data/repositories/classes'
import { LessonRepository } from './data/repositories/lessons'
import { MemberRepository } from './data/repositories/members'
import { ScheduleRepository } from './data/repositories/schedules'
import { AnnouncementsUseCase } from './domain/usecases/announcements'
import { ClassesUseCase } from './domain/usecases/classes'
import { LessonsUseCase } from './domain/usecases/lessons'
import { MembersUseCase } from './domain/usecases/members'
import { SchedulesUseCase } from './domain/usecases/schedules'

export const AnnouncementsUseCases = new AnnouncementsUseCase(AnnouncementRepository.getInstance)
export const ClassesUseCases = new ClassesUseCase(ClassRepository.getInstance)
export const LessonsUseCases = new LessonsUseCase(LessonRepository.getInstance)
export const MembersUseCases = new MembersUseCase(MemberRepository.getInstance)
export const SchedulesUseCases = new SchedulesUseCase(ScheduleRepository.getInstance)

export { AnnouncementEntity } from './domain/entities/announcements'
export { ClassEntity } from './domain/entities/classes'
export { MemberEntity } from './domain/entities/members'
export { ScheduleEntity } from './domain/entities/schedules'
export { AnnouncementFactory } from './domain/factories/announcements'
export { ClassFactory } from './domain/factories/classes'
export { LessonCurriculumFactory } from './domain/factories/lessonCurriculums'
export { LessonFactory } from './domain/factories/lessons'
export { ScheduleFactory } from './domain/factories/schedules'
export { ClassLessonable, MemberTypes, CurriculumView, ScheduleStatus } from './domain/types'
export type { ClassLesson, ExtendedClassLessonCurriculumSectionItem, ExtendCurriculum } from './domain/types'
