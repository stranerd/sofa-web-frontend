import { computed } from 'vue'
import { useAuth } from './auth/auth'
import { Logic } from 'sofa-logic'

export const useHomeTasks = () => {
	const { user, userType } = useAuth()

	const profileSteps = computed(() =>
		user.value
			? [
					{
						title: 'Add profile',
						subTitle: 'Picture, name and bio',
						icon: 'add-profile' as const,
						iconSize: 'h-[46px]',
						isDone: user.value?.checkTaskState('profile_setup'),
						action: () => Logic.Common.GoToRoute('/settings/profile#profile'),
					},
					{
						title: userType.value.isTeacher ? 'Add experience' : 'Add education',
						subTitle: 'Current place you teach at',
						icon: 'add-education' as const,
						iconSize: 'h-[46px]',
						isDone: user.value?.checkTaskState('education_setup'),
						action: () => Logic.Common.GoToRoute('/settings/profile#type'),
					},
					/* {
						title: 'Add phone',
						subTitle: 'Enter your phone number',
						icon: 'add-phone' as const,
						iconSize: 'h-[46px]',
						isDone: !!auth.value?.phone,
						action: () => Logic.Common.GoToRoute('/settings/profile#contact'),
					}, */
				]
			: [],
	)

	const studyMaterialsSteps = computed(() =>
		user.value
			? [
					{
						title: 'Create a quiz',
						subTitle: 'Build a customized quiz with different question types and study modes',
						icon: 'pink-question' as const,
						iconSize: 'h-[46px]',
						isDone: user.value?.checkTaskState('create_quiz'),
						action: () => Logic.Common.GoToRoute('/quiz/create'),
					},
					{
						title: 'Create a course',
						subTitle: 'Develop and publish a series of educational material on a particular subject',
						icon: 'orange-list' as const,
						iconSize: 'h-[46px]',
						isDone: user.value?.checkTaskState('create_course'),
						action: () => Logic.Common.GoToRoute('/course/create'),
					},
				]
			: [],
	)

	const takeOnTasks = computed(() =>
		user.value
			? [
					{
						title: 'Learn a quiz',
						subTitle: 'Practice alone with a quiz',
						icon: 'learn-quiz' as const,
						isDone: user.value?.checkTaskState('learn_quiz'),
						iconSize: 'h-[46px]',
						action: () => Logic.Common.GoToRoute('/marketplace'),
					},
					{
						title: 'Study flashcards',
						subTitle: 'Learn flashcards on a quiz',
						icon: 'study-flashcard' as const,
						isDone: user.value?.checkTaskState('quiz_flashcard'),
						iconSize: 'h-[46px]',
						action: () => Logic.Common.GoToRoute('/marketplace'),
					},
					{
						title: 'Play a quiz game ',
						subTitle: 'Challenge your friends',
						icon: 'play-quiz' as const,
						isDone: user.value?.checkTaskState('quiz_game'),
						iconSize: 'h-[46px]',
						action: () => Logic.Common.GoToRoute('/marketplace'),
					},
				]
			: [],
	)

	return { profileSteps, studyMaterialsSteps, takeOnTasks }
}
