import type { StudyMaterial } from '../..'
import { StudyKeys } from '../types'

export interface IStudyRepository {
	get: (key: StudyKeys) => Promise<StudyMaterial[]>
}
