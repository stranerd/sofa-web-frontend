import { useModals } from './core/modals'
import { InteractionEntities } from '@modules/interactions'
import { CourseEntity, QuizEntity } from '@modules/study'
import { Logic } from 'sofa-logic'

export const openMaterial = (material: QuizEntity | CourseEntity, force = false) => {
	if (!force && ((material.isDraft && material.canEdit(Logic.Common.AuthUser?.id ?? '')) || (material.isQuiz() && material.isForTutors)))
		return Logic.Common.GoToRoute(material.isQuiz() ? `/study/quizzes/${material.id}/edit` : `/study/courses/${material.id}/edit`)
	if (material.isCourse()) Logic.Common.GoToRoute(`/study/courses/${material.id}`)
	if (material.isQuiz()) useModals().study.chooseStudyMode.open({ quiz: material })
}

export const reportMaterial = (material: QuizEntity | CourseEntity) => {
	useModals().interactions.createReport.open({
		id: material.id,
		type: material.isQuiz() ? InteractionEntities.quizzes : InteractionEntities.courses,
	})
}

export const shareMaterialLink = (material: QuizEntity | CourseEntity) => {
	Logic.Common.share(`${material.isQuiz() ? 'Quiz' : 'Course'} on SOFA`, `View ${material.title} on SOFA`, material.shareLink)
}
