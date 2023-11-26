import { Logic, Tags } from 'sofa-logic'
import { onMounted, onUnmounted, ref } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	topics: ref<Tags[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return Logic.Common.listenToMany<Tags>('interactions/tags', {
			created: async (entity) => {
				Logic.addToArray(store.topics.value, entity, (e) => e.id, (e) => e.title, true)
			},
			updated: async (entity) => {
				Logic.addToArray(store.topics.value, entity, (e) => e.id, (e) => e.title, true)
			},
			deleted: async (entity) => {
				store.topics.value = store.topics.value.filter((m) => m.id !== entity.id)
			}
		}, (tag) => tag.type === 'topics')
	})
}

export const useTopicsList = () => {
	const fetchTopics = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const tags = await Logic.Study.GetTags({
				where: [{ field: 'type', value: 'topics' }],
				all: true
			})
			tags.results.forEach((r) => Logic.addToArray(store.topics.value, r, (e) => e.id, (e) => e.title, true))
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (!store.fetched.value && !store.loading.value) await fetchTopics()
		// await store.listener.start()
	})
	onUnmounted(async () => {
		// await store.listener.close()
	})

	return { ...store }
}