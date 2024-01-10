import { ClassFactory, ClassesUseCases, ClassEntity } from '@modules/organizations'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { useAuth } from '../auth/auth'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const store = {
	classes: ref<ClassEntity[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
}

export const selectedItem = ref<ClassEntity | undefined>(undefined)

export const showMoreOptions = ref(false)

export const showMoreOptionHandler = (data: ClassEntity) => {
	showMoreOptions.value = true
	selectedItem.value = data
}

export const useMyClasses = () => {
	const { id } = useAuth()

	const fetchClasses = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const classes = await ClassesUseCases.getAll(id.value)
			store.classes.value = classes.results
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (!store.fetched.value && !store.loading.value) await fetchClasses()
		// await store.listener.start()
	})
	onUnmounted(async () => {
		// await store.listener.close()
	})

	return { ...store }
}


export const useCreateClass = (organizationId: string) => {
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const factory = new ClassFactory()

	const createClass = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await ClassesUseCases.add(organizationId, factory)
				factory.reset()
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, createClass }
}
