import { PracticeFromModel } from '../../data/models/practice'
import { PlayTypes } from '../types'
import { PlayEntity } from './plays'

export class PracticeEntity extends PlayEntity {
	constructor(data: PracticeFromModel) {
		super(PlayTypes.practice, data)
	}
}
