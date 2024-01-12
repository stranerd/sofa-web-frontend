import { ClassEntity, ClassFactory, ClassesUseCases } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'

export const selectedClass = ref<ClassEntity | undefined>(undefined)
export const showMoreOptions = ref(false)
export const showCreateClassModal = ref(false)
export const showEditClassModal = ref(false)

export const moreOptions = reactive([
	{
		icon: 'edit-option',
		title: 'Edit',
		show: () => {},
		action: () => {
			showEditClassModal.value = true
			showMoreOptions.value = false
		},
	},
	{
		icon: 'share-option',
		title: 'Share',
		show: () => {},
		action: () => {
			showMoreOptions.value = false
		},
	},
	{
		icon: 'delete-quiz',
		title: 'Delete',
		show: () => {},
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
	listener: useListener(async () => {
		const { id } = useAuth()
		return ClassesUseCases.listenToAll(id.value, {
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

	const {
		asyncFn: fetchClasses,
		loading,
		error,
	} = useAsyncFn(
		async () => {
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
		},
		{ key: 'organizations/classes/mine' },
	)

	onMounted(async () => {
		if (!store.fetched.value) await fetchClasses()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store, loading, error }
}

export const useCreateClass = (organizationId: string) => {
	const factory = new ClassFactory()
	const created = ref(false)

	const {
		asyncFn: createClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ClassesUseCases.add(organizationId, factory)
		created.value = true
		factory.reset()
	})

	return { error, loading, factory, createClass, created }
}

export const useUpdateClass = (organizationId: string, classInst: ClassEntity) => {
	const factory = new ClassFactory()
	factory.loadEntity(classInst)
	const { setMessage } = useSuccessHandler()
	const updated = ref(false)
	const {
		asyncFn: updateClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ClassesUseCases.update(organizationId, classInst.id, factory)
		setMessage('Class updated successfully')
		updated.value = true
		selectedClass.value = undefined
	})

	return { error, loading, factory, updateClass, updated }
}

export const useDeleteClass = (data: { id: string; organizationId: string }) => {
	const { setMessage } = useSuccessHandler()
	const {
		asyncFn: deleteClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ClassesUseCases.delete(data)
		showMoreOptions.value = false
		setMessage('Class deleted successfully')
	})

	return { deleteClass, loading, error }
}
