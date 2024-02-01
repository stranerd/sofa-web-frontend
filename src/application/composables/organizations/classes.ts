import { addToArray } from 'valleyed'
import { Ref, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { Logic } from 'sofa-logic'
import { ClassEntity, ClassFactory, ClassesUseCases } from '@modules/organizations'

const orgStore: Record<
	string,
	{
		classes: Ref<ClassEntity[]>
		listener: ReturnType<typeof useListener>
	}
> = {}

export const useOrganizationClasses = (organizationId: string) => {
	orgStore[organizationId] ??= {
		classes: ref([]),
		listener: useListener(async () =>
			ClassesUseCases.listenToAll(organizationId, {
				created: async (entity) => {
					addToArray(
						orgStore[organizationId].classes.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					addToArray(
						orgStore[organizationId].classes.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				deleted: async (entity) => {
					orgStore[organizationId].classes.value = orgStore[organizationId].classes.value.filter((m) => m.id !== entity.id)
				},
			}),
		),
	}

	const {
		asyncFn: fetchClasses,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const classes = await ClassesUseCases.getAll(organizationId)
			classes.results.forEach((r) =>
				addToArray(
					orgStore[organizationId].classes.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `organizations/classes/${organizationId}` },
	)

	onMounted(async () => {
		if (!called.value) await fetchClasses()
		await orgStore[organizationId].listener.start()
	})
	onUnmounted(async () => {
		await orgStore[organizationId].listener.close()
	})

	return { ...orgStore[organizationId], loading, error }
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
		useModals().organizations.createClass.close()
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
		useModals().organizations.editClass.close()
		return true
	})

	return { error, loading, factory, updateClass }
}

export const useDeleteClass = () => {
	const { setMessage } = useSuccessHandler()
	const {
		asyncFn: deleteClass,
		loading,
		error,
	} = useAsyncFn(
		async (classInst: ClassEntity) => {
			await ClassesUseCases.delete(classInst)
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

	return { loading, error, deleteClass }
}

const singleClassStore = {} as Record<
	string,
	{
		class: Ref<ClassEntity | null>
		listener: ReturnType<typeof useListener>
	}
>

export const useClass = (organizationId: string, classId: string) => {
	const key = `${organizationId}-${classId}`
	singleClassStore[key] ??= {
		class: ref(null),
		listener: useListener(async () =>
			ClassesUseCases.listenToOne(organizationId, classId, {
				created: async (entity) => {
					singleClassStore[key].class.value = entity
				},
				updated: async (entity) => {
					singleClassStore[key].class.value = entity
				},
				deleted: async (entity) => {
					singleClassStore[key].class.value = entity
				},
			}),
		),
	}

	const {
		asyncFn: fetchClass,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			singleClassStore[key].class.value = await ClassesUseCases.find(organizationId, classId)
		},
		{ key: `organizations/classes/${key}` },
	)

	onMounted(async () => {
		if (!called.value) await fetchClass()
		await singleClassStore[key].listener.start()
	})
	onUnmounted(async () => {
		await singleClassStore[key].listener.close()
	})

	return { ...singleClassStore[key], error, loading }
}

export const usePurchaseClass = () => {
	const router = useRouter()
	const {
		asyncFn: purchaseClass,
		loading,
		error,
		called,
	} = useAsyncFn(async (classInst: ClassEntity) => {
		const data = await ClassesUseCases.purchase(classInst.organizationId, classInst.id)
		if (data) {
			Logic.Common.showAlert({
				message: 'Successfully enrolled',
				type: 'success',
			})
			await router.push(classInst.pageLink)
		}
	})

	return { purchaseClass, loading, error, called }
}
