import { Logic, PlayStatus, Test } from 'sofa-logic'
import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'

const store = {
	tests: ref<Test[]>([]),
	fetched: ref(false),
	listener: useListener(async () => {
		const { id } = useAuth()
		return Logic.Common.listenToMany<Test>(
			'plays/tests',
			{
				created: async (entity) => {
					addToArray(
						store.tests.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					addToArray(
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

	const {
		asyncFn: fetchTests,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			const tests = await Logic.Plays.GetTests({
				where: [{ field: 'userId', value: id.value }],
				all: true,
			})
			tests.results.forEach((r) =>
				addToArray(
					store.tests.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
			store.fetched.value = true
		},
		{ key: 'plays/tests/mine' },
	)

	onMounted(async () => {
		/* if (!store.fetched.value) */ await fetchTests()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const ongoing = computed(() => store.tests.value.filter((p) => [PlayStatus.created, PlayStatus.started].includes(p.status)))
	const ended = computed(() => store.tests.value.filter((p) => [PlayStatus.ended, PlayStatus.scored].includes(p.status)))

	return { ...store, loading, error, ongoing, ended }
}
