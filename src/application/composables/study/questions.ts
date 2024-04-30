import { computed, onMounted, onUnmounted } from 'vue'
import { Refable, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'
import { CoursableAccess, QuestionEntity, QuestionsUseCases } from '@modules/study'

export const useQuestionsInList = (quizId: string, ids: Refable<string[]>, access: CoursableAccess['access'], listen = true) => {
	const allQuestions = computed(() => [] as QuestionEntity[])

	const { items: questions, addToList } = useItemsInList(
		'questions',
		ids,
		allQuestions,
		async (ids: string[]) => await QuestionsUseCases.getInList(quizId, ids, access),
	)

	const listener = useListener(
		async () =>
			await QuestionsUseCases.listenToInList(
				quizId,
				() => ids.value,
				{
					created: addToList,
					updated: addToList,
					deleted: () => {
						/* */
					},
				},
				access,
			),
	)

	onMounted(() => {
		if (listen) listener.start()
	})

	onUnmounted(() => {
		if (listen) listener.close()
	})

	return { questions }
}
