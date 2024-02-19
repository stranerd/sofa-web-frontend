import { PracticeEntity } from '../entities/practice'
import { IPracticeRepository } from '../irepositories/practice'
import { PlaysUseCase } from './plays'
import { PracticeToModel } from '@modules/plays/data/models/practice'

export class PracticeUseCase extends PlaysUseCase<PracticeEntity, PracticeToModel, IPracticeRepository> {}
