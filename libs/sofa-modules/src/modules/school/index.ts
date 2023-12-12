import { CourseApiDataSource } from './data/datasources/courseApi'
import { DepartmentApiDataSource } from './data/datasources/departmentApi'
import { FacultyApiDataSource } from './data/datasources/facultyApi'
import { InstitutionApiDataSource } from './data/datasources/institutionApi'
import { CourseRepository } from './data/repositories/course'
import { DepartmentRepository } from './data/repositories/department'
import { FacultyRepository } from './data/repositories/faculty'
import { InstitutionRepository } from './data/repositories/institution'
import { CourseTransformer } from './data/transformers/course'
import { DepartmentTransformer } from './data/transformers/department'
import { FacultyTransformer } from './data/transformers/faculty'
import { InstitutionTransformer } from './data/transformers/institution'
import { CourseEntity } from './domain/entities/course'
import { DepartmentEntity } from './domain/entities/department'
import { FacultyEntity } from './domain/entities/faculty'
import { InstitutionEntity } from './domain/entities/institution'
import { CourseFactory } from './domain/factories/course'
import { DepartmentFactory } from './domain/factories/department'
import { FacultyFactory } from './domain/factories/faculty'
import { InstitutionFactory } from './domain/factories/institution'
import { CoursesUseCase } from './domain/usecases/courses'
import { DepartmentsUseCase } from './domain/usecases/departments'
import { FacultiesUseCase } from './domain/usecases/faculties'
import { InstitutionsUseCase } from './domain/usecases/institutions'

const courseDataSource = new CourseApiDataSource()
const institutionDataSource = new InstitutionApiDataSource()
const facultyDataSource = new FacultyApiDataSource()
const departmentDataSource = new DepartmentApiDataSource()

const courseTransformer = new CourseTransformer()
const institutionTransformer = new InstitutionTransformer()
const facultyTransformer = new FacultyTransformer()
const departmentTransformer = new DepartmentTransformer()

const courseRepository = new CourseRepository(courseDataSource, courseTransformer)
const institutionRepository = new InstitutionRepository(institutionDataSource, institutionTransformer)
const facultyRepository = new FacultyRepository(facultyDataSource, facultyTransformer)
const departmentRepository = new DepartmentRepository(departmentDataSource, departmentTransformer)

export const InstitutionsUseCases = new InstitutionsUseCase(institutionRepository)
export const FacultiesUseCases = new FacultiesUseCase(facultyRepository)
export const DepartmentsUseCases = new DepartmentsUseCase(departmentRepository)
export const CoursesUseCases = new CoursesUseCase(courseRepository)

export { CourseEntity, CourseFactory, DepartmentEntity, DepartmentFactory, FacultyEntity, FacultyFactory, InstitutionEntity, InstitutionFactory }
