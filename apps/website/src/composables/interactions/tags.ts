import { TagEntity, TagsUseCases } from '@modules/interactions'
import { Logic } from 'sofa-logic'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const topicStore = {
	topics: reactive<TagEntity[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return TagsUseCases.listenToAllTopics({
			created: async (entity) => {
				Logic.addToArray(topicStore.topics, entity, (e) => e.id, (e) => e.title, true)
			},
			updated: async (entity) => {
				Logic.addToArray(topicStore.topics, entity, (e) => e.id, (e) => e.title, true)
			},
			deleted: async (entity) => {
				topicStore.topics = topicStore.topics.filter((m) => m.id !== entity.id)
			}
		})
	})
}

const genericStore = {
	tags: reactive<TagEntity[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return TagsUseCases.listenToAllGeneric({
			created: async (entity) => {
				Logic.addToArray(genericStore.tags, entity, (e) => e.id, (e) => e.meta.total)
			},
			updated: async (entity) => {
				Logic.addToArray(genericStore.tags, entity, (e) => e.id, (e) => e.meta.total)
			},
			deleted: async (entity) => {
				genericStore.tags = genericStore.tags.filter((m) => m.id !== entity.id)
			}
		})
	})
}

export const useTopicsList = () => {
	const fetchTopics = async () => {
		if (topicStore.loading.value) return
		try {
			await topicStore.setError('')
			await topicStore.setLoading(true)
			const tags = await TagsUseCases.getAllTopics()
			tags.results.forEach((r) => Logic.addToArray(topicStore.topics, r, (e) => e.id, (e) => e.title, true))
			topicStore.fetched.value = true
		} catch (e) {
			await topicStore.setError(e)
		}
		await topicStore.setLoading(false)
	}

	onMounted(async () => {
		if (!topicStore.fetched.value && !topicStore.loading.value) await fetchTopics()
		await topicStore.listener.start()
	})
	onUnmounted(async () => {
		await topicStore.listener.close()
	})

	return { ...topicStore }
}

export const useGenericTagsList = () => {
	const fetchTags = async () => {
		if (genericStore.loading.value) return
		try {
			await genericStore.setError('')
			await genericStore.setLoading(true)
			const tags = await TagsUseCases.getAllGeneric()
			tags.results.forEach((r) => Logic.addToArray(genericStore.tags, r, (e) => e.id, (e) => e.meta.total))
			genericStore.fetched.value = true
		} catch (e) {
			await genericStore.setError(e)
		}
		await genericStore.setLoading(false)
	}

	onMounted(async () => {
		if (!genericStore.fetched.value && !genericStore.loading.value) await fetchTags()
		await genericStore.listener.start()
	})
	onUnmounted(async () => {
		await genericStore.listener.close()
	})

	return { ...genericStore }
}