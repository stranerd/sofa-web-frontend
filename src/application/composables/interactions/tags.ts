import { addToArray } from 'valleyed'
import { onMounted, onUnmounted, reactive } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { TagEntity, TagsUseCases } from '@modules/interactions'

const topicStore = {
	topics: reactive<TagEntity[]>([]),
	listener: useListener(async () =>
		TagsUseCases.listenToAllTopics({
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
		}),
	),
}

const genericStore = {
	tags: reactive<TagEntity[]>([]),
	listener: useListener(async () =>
		TagsUseCases.listenToAllGeneric({
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
		}),
	),
}

export const useTopicsList = () => {
	const {
		asyncFn: fetchTopics,
		loading,
		error,
		called,
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
		},
		{ key: 'interactions/tags/topics' },
	)

	onMounted(async () => {
		if (!called.value) await fetchTopics()
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
		called,
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
		},
		{ key: 'interactions/tags/generic' },
	)

	onMounted(async () => {
		if (!called.value) await fetchGeneric()
		await genericStore.listener.start()
	})
	onUnmounted(async () => {
		await genericStore.listener.close()
	})

	return { ...genericStore, loading, error }
}
