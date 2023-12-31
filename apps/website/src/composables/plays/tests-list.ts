import { Logic, PlayStatus, Test } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	tests: ref<Test[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id } = useAuth()
		return Logic.Common.listenToMany<Test>(
			'plays/tests',
			{
				created: async (entity) => {
					Logic.addToArray(
						store.tests.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					Logic.addToArray(
						store.tests.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				deleted: async (entity) => {
					store.tests.value = store.tests.value.filter((m) => m.id !== entity.id)
				},
			},
			(e) => e.userId === id.value,
		)
	}),
}

export const useMyTests = () => {
	const { id } = useAuth()

	const fetchTests = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const tests = await Logic.Plays.GetTests({
				where: [{ field: 'userId', value: id.value }],
				all: true,
			})
			tests.results.forEach((r) =>
				Logic.addToArray(
					store.tests.value,
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
		if (/* !store.fetched.value &&  */ !store.loading.value) await fetchTests()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const ongoing = computed(() => store.tests.value.filter((p) => [PlayStatus.created, PlayStatus.started].includes(p.status)))
	const ended = computed(() => store.tests.value.filter((p) => [PlayStatus.ended, PlayStatus.scored].includes(p.status)))

	return { ...store, ongoing, ended }
}
