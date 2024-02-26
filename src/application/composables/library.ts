import { toRaw } from 'vue'
import { useModals } from './core/modals'
import { InteractionEntities } from '@modules/interactions'
import { CourseEntity, QuizEntity } from '@modules/study'
import { Logic, ResourceType } from 'sofa-logic'

const createQuizData = (quiz: QuizEntity): ResourceType => ({
	original: quiz,
	title: quiz.title,
	image: quiz.photo?.link ?? '/images/default.png',
	labels: {
		color: 'pink',
		main: 'Quiz - Learn',
		sub: `${quiz.questions.length} questions`,
	},
	route: `/marketplace/${quiz.id}?type=quiz`,
	progress: 0,
	subject: Logic.Study.GetTagName(quiz.topicId),
	id: quiz.id,
	status: quiz.status,
	showMore: false,
	userId: quiz.user.id,
	type: 'quiz',
	authUserId: Logic.Common.AuthUser?.id,
	user: quiz.user,
	ratings: quiz.ratings,
	createdAt: quiz.createdAt,
})

const createCourseData = (course: CourseEntity): ResourceType => ({
	original: course,
	title: course.title,
	image: course.photo?.link ?? '/images/default.png',
	labels: {
		color: 'orange',
		main: 'Course',
		sub: `${course.sections.length} topics`,
	},
	price: course.price,
	route: `/marketplace/${course.id}?type=course`,
	progress: 0,
	subject: Logic.Study.GetTagName(course.topicId),
	user: course.user,
	authUserId: Logic.Common.AuthUser?.id,
	id: course.id,
	status: course.status,
	showMore: false,
	userId: course.user.id,
	type: 'course',
	ratings: course.ratings,
	createdAt: course.createdAt,
})

export const extractResource = (material: CourseEntity | QuizEntity) => {
	material = toRaw(material)
	return material.isQuiz() ? createQuizData(material) : createCourseData(material)
}

export const openQuiz = (activity: ResourceType, force = false) => {
	const original = activity.original as QuizEntity
	if (!force && ((activity.original.isDraft && activity.user.id === Logic.Common.AuthUser?.id) || original.isForTutors))
		return Logic.Common.GoToRoute(`/quizzes/${activity.id}/edit`)
	useModals().study.chooseStudyMode.open({ quiz: original })
}

export const openCourse = (activity: ResourceType) => {
	if (activity.original.isDraft && activity.user.id === Logic.Common.AuthUser?.id)
		return Logic.Common.GoToRoute(`/course/create?id=${activity.id}`)
	Logic.Common.GoToRoute(`/course/${activity.id}`)
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
