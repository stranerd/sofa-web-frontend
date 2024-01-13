import { TagEntity, TagsUseCases } from '@modules/interactions'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { addToArray } from 'valleyed'

const topicStore = {
	topics: reactive<TagEntity[]>([]),
	fetched: ref(false),
	listener: useListener(async () => {
		return TagsUseCases.listenToAllTopics({
			created: async (entity) => {
				addToArray(
					topicStore.topics,
					entity,
					(e) => e.id,
					(e) => e.title,
					true,
				)
			},
			updated: async (entity) => {
				addToArray(
					topicStore.topics,
					entity,
					(e) => e.id,
					(e) => e.title,
					true,
				)
			},
			deleted: async (entity) => {
				topicStore.topics = topicStore.topics.filter((m) => m.id !== entity.id)
			},
		})
	}),
}

const genericStore = {
	tags: reactive<TagEntity[]>([]),
	fetched: ref(false),
	listener: useListener(async () => {
		return TagsUseCases.listenToAllGeneric({
			created: async (entity) => {
				addToArray(
					genericStore.tags,
					entity,
					(e) => e.id,
					(e) => e.meta.total,
				)
			},
			updated: async (entity) => {
				addToArray(
					genericStore.tags,
					entity,
					(e) => e.id,
					(e) => e.meta.total,
				)
			},
			deleted: async (entity) => {
				genericStore.tags = genericStore.tags.filter((m) => m.id !== entity.id)
			},
		})
	}),
}

export const useTopicsList = () => {
	const {
		asyncFn: fetchTopics,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			const tags = await TagsUseCases.getAllTopics()
			tags.results.forEach((r) =>
				addToArray(
					topicStore.topics,
					r,
					(e) => e.id,
					(e) => e.title,
					true,
				),
			)
			topicStore.fetched.value = true
		},
		{ key: 'interactions/tags/topics' },
	)

	onMounted(async () => {
		if (!topicStore.fetched.value) await fetchTopics()
		await topicStore.listener.start()
	})
	onUnmounted(async () => {
		await topicStore.listener.close()
	})

	return { ...topicStore, loading, error }
}

export const useGenericTagsList = () => {
	const {
		asyncFn: fetchGeneric,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			const tags = await TagsUseCases.getAllGeneric()
			tags.results.forEach((r) =>
				addToArray(
					genericStore.tags,
					r,
					(e) => e.id,
					(e) => e.meta.total,
				),
			)
			genericStore.fetched.value = true
		},
		{ key: 'interactions/tags/generic' },
	)

	onMounted(async () => {
		if (!genericStore.fetched.value) await fetchGeneric()
		await genericStore.listener.start()
	})
	onUnmounted(async () => {
		await genericStore.listener.close()
	})

	return { ...genericStore, loading, error }
}
