import { Logic } from 'sofa-logic'
import { computed } from 'vue'
import { useAuth } from './auth/auth'

export const useHomeTasks = () => {
	const { user, userType } = useAuth()

	const profileSteps = computed(() => user.value ? [
		{
			title: 'Add profile',
			subTitle: 'Picture, name and bio',
			icon: 'add-profile',
			iconSize: 'h-[46px]',
			isDone: Logic.Users.CheckUserTaskState('profile_setup'),
			action: () => Logic.Common.GoToRoute('/settings/profile#profile')
		},
		{
			title: userType.value.isTeacher ? 'Add experience' : 'Add education',
			subTitle: 'Current place you teach at',
			icon: 'add-education',
			iconSize: 'h-[46px]',
			isDone: Logic.Users.CheckUserTaskState('education_setup'),
			action: () => Logic.Common.GoToRoute('/settings/profile#type')
		},
		{
			title: 'Add phone',
			subTitle: 'Enter your phone number',
			icon: 'add-phone',
			iconSize: 'h-[46px]',
			isDone: Logic.Users.CheckUserTaskState('phone_setup'),
			action: () => Logic.Common.GoToRoute('/settings/profile#contact')
		}
	] : [])

	const studyMaterialsSteps = computed(() => user.value ? [
		{
			title: 'Create a quiz',
			subTitle: 'Build a customized quiz with different question types and study modes',
			icon: 'pink-question',
			iconSize: 'h-[46px]',
			isDone: Logic.Users.CheckUserTaskState('create_quiz'),
			action: () => Logic.Common.GoToRoute('/quiz/create')
		},
		{
			title: 'Create a course',
			subTitle: 'Develop and publish a series of educational material on a particular subject',
			icon: 'orange-list',
			iconSize: 'h-[46px]',
			isDone: Logic.Users.CheckUserTaskState('create_course'),
			action: () => Logic.Common.GoToRoute('/course/create')
		}
	] : [])

	const takeOnTasks = computed(() => user.value ? [
		{
			title: 'Learn a quiz',
			subTitle: 'Practice alone with a quiz',
			icon: 'learn-quiz',
			isDone: Logic.Users.CheckUserTaskState('learn_quiz'),
			iconSize: 'h-[46px]',
			action: () => Logic.Common.GoToRoute('/marketplace')
		},
		{
			title: 'Study flashcards',
			subTitle: 'Learn flashcards on a quiz',
			icon: 'study-flashcard',
			isDone: Logic.Users.CheckUserTaskState('quiz_flashcard'),
			iconSize: 'h-[46px]',
			action: () => Logic.Common.GoToRoute('/marketplace')
		},
		{
			title: 'Play a quiz game ',
			subTitle: 'Challenge your friends',
			icon: 'play-quiz',
			isDone: Logic.Users.CheckUserTaskState('quiz_game'),
			iconSize: 'h-[46px]',
			action: () => Logic.Common.GoToRoute('/marketplace')
		}
	] : [])

	return { profileSteps, studyMaterialsSteps, takeOnTasks }
}