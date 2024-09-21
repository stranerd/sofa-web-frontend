import { addToArray } from 'valleyed'
import { onMounted, onUnmounted, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { createStore } from '../core/store'
import { createTransaction } from './transactions'
import { MethodEntity } from '@modules/payment/domain/entities/methods'
import { MethodsUseCases, TransactionType } from '@modules/payment'

const store = createStore(
	{
		methods: ref<MethodEntity[]>([]),
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
	},
	'payment/methods',
)

export const useMyMethods = () => {
	const { called, asyncFn: fetchMethods } = useAsyncFn(
		async () => {
			const methods = await MethodsUseCases.getAll()
			methods.results.forEach((r) =>
				addToArray(
					store.methods.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: 'payment/methods/mine' },
	)

	const { asyncFn: addMethod } = useAsyncFn(
		async () =>
			await createTransaction(
				0,
				TransactionType.newCard,
				'A test amount will be charged and added to your wallet to see if the card works fine',
			),
	)

	onMounted(async () => {
		if (!called.value) await fetchMethods()
		await store.listener.start()
	})

	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store, addMethod }
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
				await $utils.confirm({
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
			pre: async () => {
				if (method.primary) return false
				return await $utils.confirm({
					title: `Set Primary Method`,
					sub: 'Are you sure you want to set this payment method as primary?',
					right: { label: 'Yes', color: 'blue' },
				})
			},
		},
	)

	return { deleteMethod, makeMethodPrimary }
}
