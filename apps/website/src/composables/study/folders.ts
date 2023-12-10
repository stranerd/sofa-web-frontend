import { Folder, FolderFactory, Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
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

export const useEditFolder = () => {
	const factory = new FolderFactory()
	const { setLoading } = useLoadingHandler()
	const { setError } = useErrorHandler()
	const route = useRoute()

	const edit = (folder: Folder) => {
		factory.loadEntity(folder)
	}

	const saveFolder = async () => {
		const id = factory.entityId
		if (!id || !factory.valid) return factory.reset()
		const data = await factory.toModel()
		try {
			await setError('')
			await setLoading(true)
			await Logic.Study.UpdateFolder(id, data)
			factory.reset()
		} catch (e) {
			await setError(e)
		}
		await setLoading(false)
	}

	const deleteFolder = async (folder: Folder) => {
		const confirmed = await Logic.Common.confirm({
			title: 'Are you sure?',
			sub: 'This action is permanent. All items in the folder will be removed',
			rightLabel: 'Yes, delete',
		})
		if (!confirmed) return
		try {
			await setError('')
			await setLoading(true)
			await Logic.Study.DeleteFolder(folder.id)
			if (factory.entityId === folder.id) factory.reset()
			if (`/library/folders/${folder.id}` === route.path) await Logic.Common.GoToRoute('/library')
		} catch (e) {
			await setError(e)
		}
		await setLoading(false)
	}

	const generateNewFolder = async () => {
		const title = `New folder (${Logic.Common.makeid(4)})`
		try {
			await setError('')
			await setLoading(true)
			const folder = await Logic.Study.CreateFolder({ title })
			edit(folder)
		} catch (e) {
			await setError(e)
		}
		await setLoading(false)
	}

	return { factory, edit, saveFolder, generateNewFolder, deleteFolder }
}


export const useFolder = (id: string) => {
	const folderList = useMyFolders()

	const folder = computed(() => store.folders.value.find((q) => q.id === id) ?? null)

	return { ...folderList, folder }
}