import { ScheduleEntity, SchedulesUseCases } from '@modules/organizations'
import { addToArray } from 'valleyed'
import { Ref, onMounted, onUnmounted, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'

const store = {} as Record<
	string,
	{
		schedules: Ref<ScheduleEntity[]>
		hasMore: Ref<boolean>
		listener: ReturnType<typeof useListener>
	}
>

export const useClassSchedules = (organizationId: string, classId: string) => {
	const key = `${organizationId}-${classId}`
	if (store[key] === undefined) {
		const listener = useListener(() => {
			return SchedulesUseCases.listen(
				organizationId,
				classId,
				{
					created: async (entity) => {
						addToArray(
							store[key].schedules.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					updated: async (entity) => {
						addToArray(
							store[key].schedules.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					deleted: async (entity) => {
						store[key].schedules.value = store[key].schedules.value.filter((m) => m.id !== entity.id)
					},
				},
				store[key].schedules.value.at(-1)?.createdAt,
			)
		})
		store[key] = {
			schedules: ref([]),
			hasMore: ref(false),
			listener,
		}
	}

	const {
		asyncFn: fetchSchedules,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const schedules = await SchedulesUseCases.get(organizationId, classId, store[key].schedules.value.at(-1)?.createdAt)
			store[key].hasMore.value = !!schedules.pages.next
			schedules.results.map((announcement) =>
				addToArray(
					store[key].schedules.value,
					announcement,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `organizations/classes/${key}/schedules` },
	)

	const fetchOlderSchedules = async () => {
		fetchSchedules()
		await store[key].listener.start()
	}

	onMounted(async () => {
		if (!called.value) await fetchSchedules()
		await store[key].listener.restart()
	})

	onUnmounted(async () => {
		await store[key].listener.close()
	})

	return {
		...store[key],
		loading,
		error,
		fetchOlderSchedules,
		fetchSchedules,
	}
}