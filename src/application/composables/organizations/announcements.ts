import { AnnouncementEntity, AnnouncementFactory, AnnouncementsUseCases } from '@modules/organizations'
import { addToArray } from 'valleyed'
import { Ref, onMounted, onUnmounted, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'

const store = {} as Record<
	string,
	{
		announcements: Ref<AnnouncementEntity[]>
		hasMore: Ref<boolean>
		listener: ReturnType<typeof useListener>
	}
>

export const useMyAnnouncements = (organizationId: string, classId: string) => {
	const key = `${organizationId}-${classId}`
	if (store[key] === undefined) {
		const listener = useListener(() => {
			return AnnouncementsUseCases.listen(
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
			)
		})
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
		fetchAnnouncements()
		await store[key].listener.start()
	}

	onMounted(async () => {
		if (!called.value) await fetchAnnouncements()
		await store[key].listener.restart()
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

export const useMakeAnnouncement = (organizationId: string, classId: string) => {
	const factory = new AnnouncementFactory()
	const {
		asyncFn: makeAnnouncement,
		loading,
		error,
	} = useAsyncFn(async () => {
		await AnnouncementsUseCases.add(organizationId, classId, factory)
		factory.reset()
		useModals().organizations.makeAnnouncement.close()
	})

	return { error, loading, makeAnnouncement, factory }
}
