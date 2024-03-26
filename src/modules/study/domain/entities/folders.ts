import { FolderFromModel } from '../../data/models/folders'
import { FolderSaved } from '../types'
import type { CourseEntity } from './courses'
import type { QuizEntity } from './quizzes'
import { BaseEntity } from '@modules/core'

export class FolderEntity extends BaseEntity<FolderFromModel> {
	constructor(data: FolderFromModel) {
		super(data)
	}

	hasItem(entity: CourseEntity | QuizEntity) {
		return this.saved[entity.isCourse() ? FolderSaved.courses : FolderSaved.quizzes].includes(entity.id)
	}
}
