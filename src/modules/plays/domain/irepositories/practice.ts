import { PracticeEntity } from '../entities/practice'
import { IPlayRepository } from './plays'
import { PracticeToModel } from '@modules/plays/data/models/practice'

export interface IPracticeRepository extends IPlayRepository<PracticeEntity, PracticeToModel> {}
