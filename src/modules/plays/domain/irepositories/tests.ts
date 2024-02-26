import { TestToModel } from '../../data/models/tests'
import { TestEntity } from '../entities/tests'
import { IPlayRepository } from './plays'

export interface ITestRepository extends IPlayRepository<TestEntity, TestToModel> {}
