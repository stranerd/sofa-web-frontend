import { ClassFactory, ClassesUseCases, ClassEntity } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { useAuth } from '../auth/auth'
import { computed, onMounted, onUnmounted, ref, reactive } from 'vue'

const store = {
	classes: ref<ClassEntity[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id } = useAuth()
		return ClassesUseCases.listenToAllClasses(id.value, {
			created: async (entity) => {
				Logic.addToArray(
					store.classes.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				Logic.addToArray(
					store.classes.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				store.classes.value = store.classes.value.filter((m) => m.id !== entity.id)
			},
		})
	}),
}

export const selectedItem = ref<ClassEntity | undefined>(undefined)
export const showMoreOptions = ref(false)
export const moreOptions = reactive([
	{
		icon: 'edit-option',
		title: 'Edit',
		show: () => { },
		action: () => {
			showMoreOptions.value = false
		},
	},
	{
		icon: 'share-option',
		title: 'Share',
		show: () => { },
		action: () => {
			showMoreOptions.value = false
		},
	},
	{
		icon: 'delete-quiz',
		title: 'Delete',
		show: () => { },
		action: () => {
			showMoreOptions.value = false
		},
	},
])

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
			classes.results.forEach((r) =>
				Logic.addToArray(
					store.classes.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (!store.fetched.value && !store.loading.value) await fetchClasses()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store }
}

export const useCreateClass = (organizationId: string) => {
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const factory = new ClassFactory()
	const created = ref(false);

	const createClass = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await ClassesUseCases.add(organizationId, factory)
					.then((data) => {
						if (data) {
							created.value = true
						}
					})
				factory.reset()
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, createClass, created }
}
