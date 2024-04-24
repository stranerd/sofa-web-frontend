import { useAuth } from '../auth/auth'
import { useModals } from '../core/modals'
import { InteractionEntities } from '@modules/interactions'
import { StudyMaterial } from '@modules/study'

export const openMaterial = (material: StudyMaterial, force = false) => {
	const { id } = useAuth()
	if (!force && ((material.isDraft && material.canEdit(id.value)) || (material.isQuiz() && material.isForTutors)))
		return $utils.router.push(material.isQuiz() ? `/study/quizzes/${material.id}/edit` : `/study/courses/${material.id}/edit`)
	if (material.isCourse()) $utils.router.push(`/study/courses/${material.id}`)
	if (material.isQuiz()) useModals().study.chooseStudyMode.open({ quiz: material })
}

export const reportMaterial = (material: StudyMaterial) => {
	useModals().interactions.createReport.open({
		id: material.id,
		type: material.isQuiz() ? InteractionEntities.quizzes : InteractionEntities.courses,
	})
}

export const shareMaterialLink = (material: StudyMaterial) => {
	$utils.share(`${material.isQuiz() ? 'Quiz' : 'Course'} on SOFA`, `View ${material.title} on SOFA`, material.shareLink)
}
