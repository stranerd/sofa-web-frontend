import { onMounted, ref } from 'vue'
import { addToArray } from 'valleyed'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { MethodEntity } from '@modules/payment/domain/entities/methods'
import { MethodsUseCases } from '@modules/payment'
import { Logic } from 'sofa-logic'

const store = {
	methods: ref([] as MethodEntity[]),
	listener: useListener(async () =>
		MethodsUseCases.listenToAll({
			created: async (entity) => {
				addToArray(
					store.methods.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
					store.methods.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				store.methods.value = store.methods.value.filter((m) => m.id !== entity.id)
			},
		}),
	),
}

export const useMethodsList = () => {
	const { called, asyncFn: fetchMethods } = useAsyncFn(async () => {
		const methods = await MethodsUseCases.getAll()
		methods.results.forEach((r) =>
			addToArray(
				store.methods.value,
				r,
				(e) => e.id,
				(e) => e.createdAt,
			),
		)
	})

	onMounted(async () => {
		if (!called.value) await fetchMethods()
	})
}

export const useMethod = (method: MethodEntity) => {
	const { setMessage } = useSuccessHandler()

	const { asyncFn: deleteMethod } = useAsyncFn(
		async () => {
			await MethodsUseCases.delete(method.id)
			setMessage('Method deleted successfully')
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: `Delete`,
					sub: 'Are you sure you want to delete this method?',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	const { asyncFn: makeMethodPrimary } = useAsyncFn(
		async () => {
			await MethodsUseCases.makePrimary(method.id)
			setMessage('Method set as primary successfully')
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: `Set Primary Method`,
					sub: 'Are you sure you want to set this payment method as primary?',
					right: { label: 'Yes' },
				}),
		},
	)

	return { deleteMethod, makeMethodPrimary }
}
