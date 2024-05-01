import { addToArray } from 'valleyed'
import { Ref, computed, onMounted, onUnmounted, ref } from 'vue'
import { Refable, useAsyncFn, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'
import { ClassEntity, ClassLesson, ScheduleEntity, ScheduleFactory, SchedulesUseCases } from '@modules/organizations'

const store = {} as Record<
	string,
	{
		schedules: Ref<ScheduleEntity[]>
		listener: ReturnType<typeof useListener>
	}
>

export const useClassSchedules = (organizationId: string, classId: string) => {
	const key = `${organizationId}-${classId}`
	if (store[key] === undefined) {
		const listener = useListener(() =>
			SchedulesUseCases.listenToAll(organizationId, classId, {
				created: async (entity) => {
					addToArray(
						store[key].schedules.value,
						entity,
						(e) => e.id,
						(e) => e.time.start,
					)
				},
				updated: async (entity) => {
					addToArray(
						store[key].schedules.value,
						entity,
						(e) => e.id,
						(e) => e.time.start,
					)
				},
				deleted: async (entity) => {
					store[key].schedules.value = store[key].schedules.value.filter((m) => m.id !== entity.id)
				},
			}),
		)
		store[key] = {
			schedules: ref([]),
			listener,
		}
	}

	const upcoming = computed(() => {
		const now = Date.now()
		return store[key].schedules.value.filter((s) => s.time.end > now).reverse()
	})

	const previous = computed(() => {
		const now = Date.now()
		return store[key].schedules.value.filter((s) => s.time.end < now)
	})

	const {
		asyncFn: fetchSchedules,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const schedules = await SchedulesUseCases.getAll(organizationId, classId)
			schedules.results.map((announcement) =>
				addToArray(
					store[key].schedules.value,
					announcement,
					(e) => e.id,
					(e) => e.time.start,
				),
			)
		},
		{ key: `organizations/classes/${key}/schedules` },
	)

	onMounted(async () => {
		if (!called.value) await fetchSchedules()
		await store[key].listener.start()
	})

	onUnmounted(async () => {
		await store[key].listener.close()
	})

	return {
		...store[key],
		upcoming,
		previous,
		loading,
		error,
		fetchSchedules,
	}
}

export const useCreateSchedule = (classInst: ClassEntity, lesson: ClassLesson) => {
	const factory = new ScheduleFactory()

	const {
		asyncFn: createSchedule,
		loading,
		error,
	} = useAsyncFn(async () => await SchedulesUseCases.create(classInst.organizationId, classInst.id, lesson.id, factory))

	return { factory, loading, error, createSchedule }
}

export const useSchedulesInList = (organizationId: string, classId: string, ids: Refable<string[]>, listen = true) => {
	const key = `${organizationId}-${classId}`
	const allSchedules = computed(() => store[key]?.schedules.value ?? [])

	const listener = useListener(
		async () =>
			await SchedulesUseCases.listenToInList(organizationId, classId, () => ids.value, {
				created: addToList,
				updated: addToList,
				deleted: () => {
					/* */
				},
			}),
	)

	const { items: schedules, addToList } = useItemsInList(
		'schedules',
		ids,
		allSchedules,
		(ids) => SchedulesUseCases.getInList(organizationId, classId, ids),
		listen ? listener : undefined,
	)

	return { schedules }
}

export const useDeleteSchedule = () => {
	const {
		asyncFn: deleteSchedule,
		loading,
		error,
	} = useAsyncFn(
		async (schedule: ScheduleEntity) => {
			await SchedulesUseCases.delete(schedule)
			return true
		},
		{
			pre: async () =>
				await $utils.confirm({
					title: 'Are you sure?',
					sub: 'This action is permanent.',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	return { deleteSchedule, error, loading }
}

export const useStartSchedule = (classInst: ClassEntity, schedule: ScheduleEntity) => {
	const { asyncFn: copyKey } = useAsyncFn(async (s = schedule) => {
		if (s.stream) await $utils.copy(s.stream.streamKey)
	})

	const { asyncFn: join } = useAsyncFn(async (s = schedule) => {
		await window.open(s.meetingLink, '_blank')
	})

	const { asyncFn: rewatch } = useAsyncFn(async (s = schedule) => {
		await window.open(s.recordingLink, '_blank')
	})

	const { asyncFn: start } = useAsyncFn(
		async () => {
			const updated = await SchedulesUseCases.start({
				organizationId: schedule.organizationId,
				classId: schedule.classId,
				id: schedule.id,
			})
			if (!updated.stream) return false
			await copyKey(updated)
			await join(updated)
			return true
		},
		{
			pre: async () =>
				$utils.confirm({
					title: 'Are you sure?',
					sub: 'This action will start the schedule. It will copy your youtube record key to your clipboard and redirect you to the jitsi site. You can always come back here to copy the stream code if needed.',
					right: { label: 'Yes, start' },
				}),
		},
	)

	const { asyncFn: end } = useAsyncFn(
		async () => {
			await SchedulesUseCases.end({ organizationId: schedule.organizationId, classId: schedule.classId, id: schedule.id })
			return true
		},
		{
			pre: async () =>
				$utils.confirm({
					title: 'Are you sure?',
					sub: 'This action will end the schedule. Nobody will be able to join the live anymore.',
					right: { label: 'Yes, end' },
				}),
		},
	)

	return { copyKey, join, rewatch, start, end }
}
