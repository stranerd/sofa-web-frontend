import { addToArray } from 'valleyed'
import { Ref, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'

import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { SelectedPaymentMethod } from '@modules/payment'
import { ClassEntity, ClassFactory, ClassesUseCases } from '@modules/organizations'

const myStore: Record<
	string,
	{
		classes: Ref<ClassEntity[]>
		listener: ReturnType<typeof useListener>
	}
> = {}

const similarStore: Record<
	string,
	{
		classes: Ref<ClassEntity[]>
	}
> = {}

export const useMyClasses = () => {
	const { id, user } = useAuth()
	const key = id.value

	myStore[key] ??= {
		classes: ref([]),
		listener: useListener(async () =>
			ClassesUseCases.listenToMyClassesIn(user.value!, {
				created: async (entity) => {
					addToArray(
						myStore[key].classes.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					addToArray(
						myStore[key].classes.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				deleted: async (entity) => {
					myStore[key].classes.value = myStore[key].classes.value.filter((m) => m.id !== entity.id)
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
			const classes = await ClassesUseCases.getMyClassesIn(user.value!)
			classes.results.forEach((r) =>
				addToArray(
					myStore[key].classes.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `organizations/classes/${key}` },
	)

	onMounted(async () => {
		if (!called.value) await fetchClasses()
		await myStore[key].listener.start()
	})
	onUnmounted(async () => {
		await myStore[key].listener.close()
	})

	return { ...myStore[key], loading, error }
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
				await $utils.confirm({
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
	} = useAsyncFn(async (classInst: ClassEntity, selectedMethod: SelectedPaymentMethod) => {
		await ClassesUseCases.purchase(classInst.organizationId, classInst.id, selectedMethod)
		$utils.showAlert({
			message: 'Successfully enrolled',
			type: 'success',
		})
		await router.push(classInst.pageLink)
	})

	return { purchaseClass, loading, error }
}

export const useSimilarClasses = (organizationId: string, classId: string) => {
	const key = `${organizationId}-${classId}`
	similarStore[key] ??= {
		classes: ref([]),
	}

	const {
		asyncFn: fetchSimilarClasses,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const classes = await ClassesUseCases.getSimilarClasses(organizationId, classId)
			similarStore[key].classes.value = classes
		},
		{ key: `organizations//classes/${key}/similar` },
	)
	onMounted(async () => {
		if (!called.value) await fetchSimilarClasses()
	})
	return { ...similarStore[key], loading, error }
}
