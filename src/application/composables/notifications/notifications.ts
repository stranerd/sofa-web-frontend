import { onMounted, onUnmounted, ref, Ref, watch } from 'vue'
import { addToArray } from 'valleyed'
import { useAuth } from '../auth/auth'
import { useErrorHandler, useLoadingHandler } from '../core/states'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { NotificationEntity, NotificationsUseCases } from '@modules/notifications'

const store = {} as Record<
	string,
	{
		notifications: Ref<NotificationEntity[]>
		hasMore: Ref<boolean>
		fetched: Ref<boolean>
		listener: ReturnType<typeof useListener>
		unRead: Ref<number>
		timer: Ref<number>
		timeOut: Ref<any>
	} & ReturnType<typeof useErrorHandler> &
		ReturnType<typeof useLoadingHandler>
>

export const useNotificationList = () => {
	const { id } = useAuth()
	const userId = id.value
	if (store[userId] === undefined) {
		const listener = useListener(async () => {
			if (!userId) return () => {}
			return NotificationsUseCases.listen(
				{
					created: async (entity) => {
						addToArray(
							store[userId].notifications.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					updated: async (entity) => {
						addToArray(
							store[userId].notifications.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					deleted: async (entity) => {
						const index = store[userId].notifications.value.findIndex((t) => t.id === entity.id)
						if (index !== -1) store[userId].notifications.value.splice(index, 1)
					},
				},
				store[userId].notifications.value.at(-1)?.createdAt,
			)
		})
		store[userId] = {
			notifications: ref([]),
			hasMore: ref(false),
			fetched: ref(false),
			unRead: ref(0),
			timer: ref(0),
			timeOut: ref(null),
			listener,
			...useErrorHandler(),
			...useLoadingHandler(),
		}
		watch(store[userId].notifications, () => store[userId].timer.value++, { deep: true })
		watch(store[userId].timer, async (cur, prev) => prev > cur && cur === 0 && (await fetchUnRead()))
	}

	const {
		asyncFn: fetchNotifications,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const notifications = await NotificationsUseCases.get(store[userId].notifications.value.at(-1)?.createdAt)
			store[userId].hasMore.value = !!notifications.pages.next
			notifications.results.map((notification) =>
				addToArray(
					store[userId].notifications.value,
					notification,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `notifications/notifications/${userId}` },
	)

	const { asyncFn: fetchUnRead } = useAsyncFn(async () => {
		store[userId].unRead.value = await NotificationsUseCases.getUnReadCount()
	})

	const fetchOlderNotifications = async () => {
		await fetchNotifications()
		await store[userId].listener.restart()
	}

	onMounted(async () => {
		if (!called.value) await fetchNotifications()
		await store[userId].listener.start()
	})

	onUnmounted(async () => {
		// await store[userId].listener.close()
	})

	return { ...store[userId], loading, error, fetched: called, fetchOlderNotifications }
}

export const useNotification = (notification: NotificationEntity) => {
	const {
		asyncFn: markNotificationSeen,
		loading,
		error,
	} = useAsyncFn(async () => {
		if (notification.seen) return
		await NotificationsUseCases.toggleSeen(notification.id, true)
	})

	return { loading, error, markNotificationSeen }
}
