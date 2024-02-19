import { PracticeFromModel, PracticeToModel } from '../models/practice'
import { PlayRepository } from './plays'
import { PracticeEntity } from '@modules/plays/domain/entities/practice'
import { PlayTypes } from '@modules/plays/domain/types'
import { IPracticeRepository } from '@modules/plays/domain/irepositories/practice'

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
