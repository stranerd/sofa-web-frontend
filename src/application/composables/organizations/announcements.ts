import { AnnouncementEntity, AnnouncementsUseCases, AnnouncementFactory } from '@modules/organizations'
import { Ref, ref, computed, onMounted, onUnmounted } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { addToArray } from 'valleyed'
import { useModals } from '../core/modals'
import { useListener } from '../core/listener'

const store = {} as Record<
	string,
	{
		announcements: Ref<AnnouncementEntity[]>
		hasMore: Ref<boolean>
		listener: ReturnType<typeof useListener>
	}
>

export const useMyAnnouncements = (organizationId: string, classId: string) => {
	if (store[`${organizationId}-${classId}`] === undefined) {
		const listener = useListener(() => {
			return AnnouncementsUseCases.listen(
				organizationId,
				classId,
				{
					created: async (entity) => {
						addToArray(
							store[`${organizationId}-${classId}`].announcements.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					updated: async (entity) => {
						addToArray(
							store[`${organizationId}-${classId}`].announcements.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					deleted: async (entity) => {
						store[`${organizationId}-${classId}`].announcements.value = store[
							`${organizationId}-${classId}`
						].announcements.value.filter((m) => m.id !== entity.id)
					},
				},
				store[`${organizationId}-${classId}`].announcements.value.at(-1)?.createdAt,
			)
		})
		store[`${organizationId}-${classId}`] = {
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
			const announcements = await AnnouncementsUseCases.get(
				organizationId,
				classId,
				store[`${organizationId}-${classId}`].announcements.value.at(-1)?.createdAt,
			)
			store[`${organizationId}-${classId}`].hasMore.value = !!announcements.pages.next
			announcements.results.map((announcement) =>
				addToArray(
					store[`${organizationId}-${classId}`].announcements.value,
					announcement,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `organizations/classes/${organizationId}-${classId}/announcements` },
	)

	const fetchOlderAnnouncements = async () => {
		fetchAnnouncements()
		await store[`${organizationId}-${classId}`].listener.start()
	}

	onMounted(async () => {
		if (!called.value) await fetchAnnouncements()
		await store[`${organizationId}-${classId}`].listener.start()
	})

	onUnmounted(async () => {
		await store[`${organizationId}-${classId}`].listener.close()
	})

	return {
		announcements: computed(() => [...store[`${organizationId}-${classId}`].announcements.value]),
		loading,
		error,
		hasMore: store[`${organizationId}-${classId}`].hasMore,
		fetchOlderAnnouncements,
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
