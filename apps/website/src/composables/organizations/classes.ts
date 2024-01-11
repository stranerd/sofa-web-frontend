import { ClassFactory, ClassesUseCases, ClassEntity } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { useListener } from '../core/listener'
import { useAsyncFn } from '../core/hooks'
import { useAuth } from '../auth/auth'
import { useErrorHandler, useLoadingHandler } from '../core/states'
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
		action: async () => {
			let data = {
				id: selectedItem.value.id,
				organizationId: selectedItem.value.organizationId
			}
			await useDeleteClass(data).deleteClass()
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
	const factory = new ClassFactory()
	const created = ref(false)

	const {
		asyncFn: createClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ClassesUseCases.add(organizationId, factory).then((data) => {
			if (data) {
				created.value = true
			}
		})
		factory.reset()
	})

	return { error, loading, factory, createClass, created }
}

export const useUpdateClass = (organizationId: string, id: string) => {
	const factory = new ClassFactory()
	const updated = ref(false)

	const {
		asyncFn: updateClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ClassesUseCases.update(organizationId, id, factory).then((data) => {
			if (data) {
				updated.value = true
			}
		})
		factory.reset()
	})

	return { error, loading, factory, createClass, updated }
}


export const useDeleteClass = (data: { id: string, organizationId: string }) => {

	const deleteClass = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			await ClassesUseCases.delete(data)
				.then((data) => {
					if (data) {
						showMoreOptions.value = false
						Logic.Common.showAlert({
							message: 'Class deleted successfully',
							type: 'success',
						})
					}
				})
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	return { deleteClass }
}