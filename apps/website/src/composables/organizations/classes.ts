import { ClassFactory, ClassesUseCases, ClassEntity } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { useListener } from '../core/listener'
import { useAsyncFn } from '../core/hooks'
import { useAuth } from '../auth/auth'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { computed, onMounted, onUnmounted, ref, reactive } from 'vue'

export const factory = new ClassFactory()
export const selectedClass = ref<ClassEntity | undefined>(undefined)
export const showMoreOptions = ref(false)
export const showCreateAndEditClassModal = ref(false)
export const isEdit = ref(false)
export const updated = ref(false)
export const moreOptions = reactive([
	{
		icon: 'edit-option',
		title: 'Edit',
		show: () => { },
		action: () => {
			isEdit.value = true
			showCreateAndEditClassModal.value = true
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
			const data = {
				id: selectedClass.value.id,
				organizationId: selectedClass.value.organizationId,
			}
			await useDeleteClass(data).deleteClass()
			selectedClass.value = undefined
		},
	},
])

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

export const showMoreOptionHandler = (data: ClassEntity) => {
	showMoreOptions.value = true
	selectedClass.value = data
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

	const {
		asyncFn: createClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ClassesUseCases.add(organizationId, factory).then((data) => {
			if (data) {
				updated.value = true
			}
		})
		factory.reset()
	})

	return { error, loading, factory, createClass }
}

export const useUpdateClass = (organizationId: string, id: string) => {

	const {
		asyncFn: updateClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ClassesUseCases.update(organizationId, id, factory).then((data) => {
			if (data) {
				Logic.Common.showAlert({
					message: 'Class updated successfully',
					type: 'success',
				})
				selectedClass.value = undefined
				updated.value = true
			}
		})
		selectedClass.value = undefined
		factory.reset()
	})

	return { error, loading, factory, updateClass }
}

export const useDeleteClass = (data: { id: string; organizationId: string }) => {
	const deleteClass = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			await ClassesUseCases.delete(data).then((data) => {
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
