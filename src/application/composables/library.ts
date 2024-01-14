import { InteractionEntities } from '@modules/interactions'
import { CourseEntity, QuizEntity } from '@modules/study'
import { Game, Logic, PlayStatus, ResourceType, Test } from 'sofa-logic'
import { useModals } from './core/modals'

const createQuizData = (quiz: QuizEntity): ResourceType => {
	return {
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
	}
}

const createCourseData = (course: CourseEntity): ResourceType => {
	return {
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
	}
}

export const extractResource = (material: CourseEntity | QuizEntity) =>
	material.isQuiz() ? createQuizData(material) : createCourseData(material)

export const createGameData = (p: Game, quizzes: QuizEntity[]) => {
	const currentQuiz = quizzes.find((i) => i.id == p.quizId)
	const ended = [PlayStatus.scored, PlayStatus.ended].includes(p.status)
	const allScores = ended ? Object.values(p.scores).sort((a, b) => b - a) : []
	const userPosition = allScores.indexOf(p.scores[Logic.Common.AuthUser?.id ?? ''])

	return {
		id: p.id,
		inProgress: !ended,
		createdAt: p.createdAt,
		image: currentQuiz?.photo?.link || '/images/default.png',
		label: Logic.Common.ordinalSuffixOf(userPosition !== -1 ? userPosition + 1 : p.participants.length),
		label_color: 'text-[#3296C8]',
		title: currentQuiz?.title || 'Unknown quiz',
		type: 'game',
		participants: p.participants.length,
		action: () => {
			Logic.Common.GoToRoute(`/games/${p.id}/${ended ? 'results' : 'lobby'}`)
		},
	}
}

export const createTestData = (p: Test, quizzes: QuizEntity[]) => {
	const currentQuiz = quizzes.find((i) => i.id == p.quizId)
	const ended = [PlayStatus.scored, PlayStatus.ended].includes(p.status)
	const userCorrectAnswers = (p.scores[Logic.Common.AuthUser?.id ?? ''] ?? 0) / 10
	const percentage = (userCorrectAnswers / p.questions.length) * 100
	const textColor =
		percentage >= 90 ? 'text-[#4BAF7D]' : percentage >= 70 ? 'text-[#ADAF4B]' : percentage >= 50 ? 'text-[#3296C8]' : 'text-primaryRed'
	return {
		id: p.id,
		inProgress: !ended,
		createdAt: p.createdAt,
		image: currentQuiz?.photo?.link || '/images/default.png',
		label: `${percentage ? percentage.toFixed() : '0'}%`,
		label_color: textColor,
		title: currentQuiz?.title || 'Unknown quiz',
		type: 'test',
		participants: 1,
		action: () => {
			Logic.Common.GoToRoute(`/tests/${p.id}/${ended ? 'results' : 'lobby'}`)
		},
	}
}

export const openQuiz = (activity: ResourceType, force = false) => {
	const original = activity.original as QuizEntity
	if (!force && ((activity.original.isDraft && activity.user.id === Logic.Common.AuthUser?.id) || original.isForTutors))
		return Logic.Common.GoToRoute(`/quiz/${activity.id}/edit`)
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
