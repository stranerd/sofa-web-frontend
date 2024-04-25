import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { Refable, useAsyncFn, useItemsInList } from '../core/hooks'
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

export const useClassesInList = (ids: Refable<string[]>) => {
	const allClasses = computed(() => [...store.classesIn.value, ...store.classesExplore.value])
	const { items: classes } = useItemsInList('classes', ids, allClasses, (ids) => ClassesUseCases.getInList(ids))
	return { classes }
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
