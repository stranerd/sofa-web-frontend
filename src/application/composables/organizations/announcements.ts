import { addToArray } from 'valleyed'
import { Ref, onMounted, onUnmounted, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { createStore } from '../core/store'
import { AnnouncementEntity, AnnouncementFactory, AnnouncementsUseCases } from '@modules/organizations'

const store = createStore(
	<
		Record<
			string,
			{
				announcements: Ref<AnnouncementEntity[]>
				hasMore: Ref<boolean>
				listener: ReturnType<typeof useListener>
			}
		>
	>{},
	'organizations/announcements',
)

export const useClassAnnouncements = (organizationId: string, classId: string) => {
	const key = `${organizationId}-${classId}`
	if (store[key] === undefined) {
		const listener = useListener(() =>
			AnnouncementsUseCases.listen(
				organizationId,
				classId,
				{
					created: async (entity) => {
						addToArray(
							store[key].announcements.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					updated: async (entity) => {
						addToArray(
							store[key].announcements.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					deleted: async (entity) => {
						store[key].announcements.value = store[key].announcements.value.filter((m) => m.id !== entity.id)
					},
				},
				store[key].announcements.value.at(-1)?.createdAt,
			),
		)
		store[key] = {
			announcements: ref([]),
			hasMore: ref(false),
			listener,
		}
	}

	const {
		asyncFn: fetchAnnouncements,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const announcements = await AnnouncementsUseCases.get(organizationId, classId, store[key].announcements.value.at(-1)?.createdAt)
			store[key].hasMore.value = !!announcements.pages.next
			announcements.results.map((announcement) =>
				addToArray(
					store[key].announcements.value,
					announcement,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `organizations/classes/${key}/announcements` },
	)

	const fetchOlderAnnouncements = async () => {
		await fetchAnnouncements()
		await store[key].listener.restart()
	}

	onMounted(async () => {
		if (!called.value) await fetchAnnouncements()
		await store[key].listener.start()
	})

	onUnmounted(async () => {
		await store[key].listener.close()
	})

	return {
		...store[key],
		loading,
		error,
		fetchOlderAnnouncements,
		fetchAnnouncements,
	}
}

export const useCreateAnnouncement = (organizationId: string, classId: string) => {
	const factory = new AnnouncementFactory()
	const {
		asyncFn: createAnnouncement,
		loading,
		error,
	} = useAsyncFn(async () => {
		await AnnouncementsUseCases.add(organizationId, classId, factory)
		factory.reset()
	})

	return { error, loading, createAnnouncement, factory }
}
