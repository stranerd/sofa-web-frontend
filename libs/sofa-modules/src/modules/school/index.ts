import { CourseRepository } from './data/repositories/courses'
import { DepartmentRepository } from './data/repositories/departments'
import { FacultyRepository } from './data/repositories/faculties'
import { InstitutionRepository } from './data/repositories/institutions'
import { CourseEntity } from './domain/entities/courses'
import { DepartmentEntity } from './domain/entities/departments'
import { FacultyEntity } from './domain/entities/faculties'
import { InstitutionEntity } from './domain/entities/institutions'
import { CourseFactory } from './domain/factories/courses'
import { DepartmentFactory } from './domain/factories/departments'
import { FacultyFactory } from './domain/factories/faculties'
import { InstitutionFactory } from './domain/factories/institutions'
import { CoursesUseCase } from './domain/usecases/courses'
import { DepartmentsUseCase } from './domain/usecases/departments'
import { FacultiesUseCase } from './domain/usecases/faculties'
import { InstitutionsUseCase } from './domain/usecases/institutions'

export const InstitutionsUseCases = new InstitutionsUseCase(InstitutionRepository.getInstance)
export const FacultiesUseCases = new FacultiesUseCase(FacultyRepository.getInstance)
export const DepartmentsUseCases = new DepartmentsUseCase(DepartmentRepository.getInstance)
export const CoursesUseCases = new CoursesUseCase(CourseRepository.getInstance)

export {
	CourseEntity,
	CourseFactory,
	DepartmentEntity,
	DepartmentFactory,
	FacultyEntity,
	FacultyFactory,
	InstitutionEntity,
	InstitutionFactory,
}
