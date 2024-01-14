import { QuestionEntity, QuestionsUseCases } from '@modules/study'
import { computed, onMounted, onUnmounted } from 'vue'
import { Refable, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'

export const useQuestionsInList = (quizId: string, ids: Refable<string[]>, listen = false) => {
	const allQuestions = computed(() => [] as QuestionEntity[])

	const { items: questions, addToList } = useItemsInList('questions', ids, allQuestions, async (ids: string[]) => {
		return await QuestionsUseCases.getInList(quizId, ids)
	})

	const listener = useListener(async () => {
		return await QuestionsUseCases.listenToInList(quizId, () => ids.value, {
			created: addToList,
			updated: addToList,
			deleted: () => {
				/* */
			},
		})
	})

	onMounted(() => {
		if (listen) listener.start()
	})

	onUnmounted(() => {
		if (listen) listener.close()
	})

	return { questions }
}
