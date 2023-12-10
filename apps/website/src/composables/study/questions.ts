import { Conditions, Logic, Question } from 'sofa-logic'
import { computed, onMounted, onUnmounted } from 'vue'
import { Refable, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'


export const useQuestionsInList = (quizId: string, ids: Refable<string[]>, listen = false) => {
	const allQuestions = computed(() => [])

	const { items: questions, addToList } = useItemsInList('questions', ids, allQuestions, async (notFetched: string[]) => {
		const questions = await Logic.Study.GetQuestions(quizId, {
			where: [{ field: 'id', value: notFetched, condition: Conditions.in }],
			all: true
		})
		return questions.results
	})

	const listener = useListener(async () => {
		return await Logic.Common.listenToMany<Question>(`study/quizzes/${quizId}questions`, {
			created: addToList, updated: addToList, deleted: () => {/* */}
		},  (e) => ids.value.includes(e.id))
	})

	onMounted(() => {
		if (listen) listener.start()
	})

	onUnmounted(() => {
		if (listen) listener.close()
	})

	return { questions }
}