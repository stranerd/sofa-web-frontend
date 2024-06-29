import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { Refable, useAsyncFn, useItemsInList, usePaginatedTable } from '../core/hooks'
import { useListener } from '../core/listener'
import { similarStore } from './classes'
import { UsersUseCases } from '@modules/users'
import { ClassEntity, ClassesUseCases } from '@modules/organizations'

const store = {
	classesIn: ref<ClassEntity[]>([]),
	listener: useListener(async () => {
		const { user } = useAuth()
		return ClassesUseCases.listenToMyClassesIn(user.value!, {
			created: async (entity) => {
				addToArray(
					store.classesIn.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
					store.classesIn.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				store.classesIn.value = store.classesIn.value.filter((m) => m.id !== entity.id)
			},
		})
	}),
	classesExplore: ref<ClassEntity[]>([]),
}

export const useMyClasses = () => {
	const { user } = useAuth()
	const {
		asyncFn: fetchClasses,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const classes = await ClassesUseCases.getMyClassesIn(user.value!)
			store.classesIn.value = []
			classes.results.forEach((r) =>
				addToArray(
					store.classesIn.value,
					r,
					(e) => e.id,
					(e) => e.title,
				),
			)
		},
		{ key: 'organizations/classes/in' },
	)

	onMounted(async () => {
		if (!called.value) await fetchClasses()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { classes: store.classesIn, loading, error }
}

export const useExploreClasses = () => {
	const searchQuery = ref('')
	const {
		asyncFn: fetchClasses,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			const classes = await ClassesUseCases.explore(searchQuery.value)
			store.classesExplore.value = []
			classes.results.forEach((r) =>
				addToArray(
					store.classesExplore.value,
					r,
					(e) => e.id,
					(e) => e.title,
				),
			)
		},
		{ key: 'organizations/classes/explore' },
	)

	onMounted(async () => {
		await fetchClasses()
	})

	return { classes: store.classesExplore, searchQuery, loading, error, fetchClasses }
}

export const useClassesInList = (ids: Refable<string[]>, listen = true) => {
	const allClasses = computed(() => [
		...Object.values(similarStore).flatMap((s) => s.classes.value),
		...store.classesIn.value,
		...store.classesExplore.value,
	])

	const listener = useListener(
		async () =>
			await ClassesUseCases.listenToInList(() => ids.value, {
				created: addToList,
				updated: addToList,
				deleted: () => {},
			}),
	)

	const {
		items: classes,
		searchForItem,
		addToList,
	} = useItemsInList('classes', ids, allClasses, (ids) => ClassesUseCases.getInList(ids), listen ? listener : undefined)

	return { classes, searchForItem }
}

export const useSaveClass = (classInst: ClassEntity) => {
	const { user } = useAuth()
	const isSaved = computed(() => user.value?.account.saved.classes.includes(classInst.id))

	const {
		asyncFn: saveClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await UsersUseCases.updateSavedClasses({ classes: [classInst.id], add: !isSaved.value })
	})

	return { loading, error, saveClass, isSaved }
}

export const useClassesList = () => {
	const result = usePaginatedTable<ClassEntity>({
		key: `organizations/classes/all`,
		useCase: (lastItem) => ClassesUseCases.getAll(lastItem?.createdAt),
		comparer: (item) => item.createdAt,
		listenerFn: (handlers, lastItem) => ClassesUseCases.listenToAll(handlers, lastItem?.createdAt),
	})

	return result
}
