import { Folder, Logic } from 'sofa-logic'
import { onMounted, onUnmounted, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	folders: ref<Folder[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id } = useAuth()
		return Logic.Common.listenToMany<Folder>('study/folders', {
			created: async (entity) => {
				Logic.addToArray(store.folders.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			updated: async (entity) => {
				Logic.addToArray(store.folders.value, entity, (e) => e.id, (e) => e.createdAt)
			},
			deleted: async (entity) => {
				store.folders.value = store.folders.value.filter((m) => m.id !== entity.id)
			}
		}, (e) => e.user.id === id.value)
	})
}

export const useMyFolders = () => {
	const { id } = useAuth()

	const fetchFolders = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const folders = await Logic.Study.getFolders({
				where: [{ field: 'user.id', value: id.value }],
				all: true
			})
			folders.results.forEach((r) => Logic.addToArray(store.folders.value, r, (e) => e.id, (e) => e.createdAt))
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */!store.loading.value) await fetchFolders()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store }
}
