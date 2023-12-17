import { Logic } from 'sofa-logic'
import { ref } from 'vue'
import { showStudyMode } from './library'

export const selectedQuizId = ref('')

export const selectedQuizMode = ref('')

export const userIsParticipating = ref(true)

export const goToStudyMode = async (id: string, type: string) => {
	selectedQuizId.value = id
	selectedQuizMode.value = type

	await Logic.Study.GoToStudyMode(type, id)

	if (type == 'game') return showStudyMode.value = true
	showStudyMode.value = false
}

export const otherTasks = [
	{
		title: 'Practice',
		subTitle: 'Interactive and comfortable learning',
		icon: 'learn-quiz',
		iconSize: 'h-[46px]',
		actionFn: goToStudyMode,
		key: 'practice',
	},
	{
		title: 'Test',
		subTitle: 'Evaluate your level of knowledge',
		icon: 'test',
		iconSize: 'h-[46px]',
		actionFn: goToStudyMode,
		key: 'test',
	},
	{
		title: 'Flashcards',
		subTitle: 'Digital cards to memorize answers',
		icon: 'study-flashcard',
		iconSize: 'h-[46px]',
		actionFn: goToStudyMode,
		key: 'flashcard',
	},
	{
		title: 'Game',
		subTitle: 'Battle friends for the highest score',
		icon: 'play-quiz',
		iconSize: 'h-[46px]',
		actionFn: goToStudyMode,
		key: 'game',
	},
	// {
	//   title: 'Assignment',
	//   subTitle: 'Share as homework with a deadline',
	//   icon: 'assignment',
	//   iconSize: 'h-[46px]',
	//   actionFn: goToStudyMode,
	//   key: 'assignment',
	// },
]

export const createQuizGame = async () => {
	if (!selectedQuizId.value) return
	Logic.Common.showLoading()

	Logic.Plays.CreateGameForm = {
		quizId: selectedQuizId.value,
		join: userIsParticipating.value
	}

	await Logic.Plays.CreateGame(true).then(async (game) => {
		if (game) {
			Logic.Common.hideLoading()
			showStudyMode.value = false
			await Logic.Common.GoToRoute( `/games/${game.id}`)
		}
	})
}
