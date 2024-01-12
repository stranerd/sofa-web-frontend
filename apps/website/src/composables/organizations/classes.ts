import { ClassEntity, ClassFactory, ClassesUseCases } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { useRouter } from 'vue-router'
import { useOrganizationModal } from '../core/modals'

export const selectedClass = ref<ClassEntity | null>(null)
export const showMoreOptions = ref(false)
export const showCreateClassModal = ref(false)
export const showEditClassModal = ref(false)

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

	const { setMessage } = useSuccessHandler()
	const { asyncFn: deleteClass } = useAsyncFn(
		async (classInst: ClassEntity) => {
			await ClassesUseCases.delete(classInst)
			showMoreOptions.value = false
			setMessage('Class deleted successfully')
		},
		{
			pre: async (classInst) =>
				await Logic.Common.confirm({
					title: `Delete ${classInst.title}`,
					sub: 'Are you sure you want to delete this class?',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	onMounted(async () => {
		if (!store.fetched.value) await fetchClasses()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store, loading, error, deleteClass }
}

export const useCreateClass = (organizationId: string) => {
	const router = useRouter()
	const factory = new ClassFactory()
	const {
		asyncFn: createClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		const classInst = await ClassesUseCases.add(organizationId, factory)
		factory.reset()
		useOrganizationModal().closeCreateClass()
		await router.push(classInst.pageLink)
		return true
	})

	return { error, loading, factory, createClass }
}

export const useUpdateClass = (organizationId: string, classInst: ClassEntity) => {
	const factory = new ClassFactory()
	const { setMessage } = useSuccessHandler()
	factory.loadEntity(classInst)

	const {
		asyncFn: updateClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ClassesUseCases.update(organizationId, classInst.id, factory)
		setMessage('Class updated successfully')
		factory.reset()
		useOrganizationModal().closeEditClass()
		return true
	})

	return { error, loading, factory, updateClass }
}
