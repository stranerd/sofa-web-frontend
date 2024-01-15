import { ClassEntity, ClassesUseCases } from '@modules/organizations'
import { onMounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { addToArray } from 'valleyed'

const store = {
	classesIn: ref<ClassEntity[]>([]),
	classesExplore: ref<ClassEntity[]>([]),
}

export const useMyClassesIn = () => {
	const { id } = useAuth()
	const {
		asyncFn: fetchClasses,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			store.classesIn.value = []
			const classes = await ClassesUseCases.getMyClassesIn(id.value)
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
		await fetchClasses()
	})

	return { classes: store.classesIn, loading, error }
}

export const useExploreClasses = () => {
	const {
		asyncFn: fetchClasses,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			store.classesExplore.value = []
			const classes = await ClassesUseCases.explore()
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

	return { classes: store.classesExplore, loading, error }
}
