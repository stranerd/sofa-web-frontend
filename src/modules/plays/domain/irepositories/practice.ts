import { PracticeToModel } from '../../data/models/practice'
import { PracticeEntity } from '../entities/practice'
import { IPlayRepository } from './plays'

export interface IPracticeRepository extends IPlayRepository<PracticeEntity, PracticeToModel> {}
