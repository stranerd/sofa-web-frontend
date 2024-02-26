import { PracticeEntity } from '../../domain/entities/practice'
import { IPracticeRepository } from '../../domain/irepositories/practice'
import { PlayTypes } from '../../domain/types'
import { PracticeFromModel, PracticeToModel } from '../models/practice'
import { PlayRepository } from './plays'

export class PracticeRepository extends PlayRepository<PracticeEntity, PracticeFromModel, PracticeToModel> implements IPracticeRepository {
	private static instance: PracticeRepository

	private constructor() {
		super(PlayTypes.tests, (model: PracticeFromModel | null) => (model ? new PracticeEntity(model) : null) as PracticeEntity)
	}

	static getInstance() {
		if (!PracticeRepository.instance) PracticeRepository.instance = new PracticeRepository()
		return PracticeRepository.instance
	}
}
