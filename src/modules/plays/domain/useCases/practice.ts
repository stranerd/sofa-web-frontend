import { PracticeToModel } from '../../data/models/practice'
import { PracticeEntity } from '../entities/practice'
import { IPracticeRepository } from '../irepositories/practice'
import { PlaysUseCase } from './plays'

export class PracticeUseCase extends PlaysUseCase<PracticeEntity, PracticeToModel, IPracticeRepository> {}
