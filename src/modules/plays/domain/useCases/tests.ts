import { TestToModel } from '../../data/models/tests'
import { ITestRepository } from '../irepositories/tests'
import { TestEntity } from '../entities/tests'
import { PlaysUseCase } from './plays'

export class TestsUseCase extends PlaysUseCase<TestEntity, TestToModel, ITestRepository> {}
