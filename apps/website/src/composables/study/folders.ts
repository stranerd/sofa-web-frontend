import { FolderEntity, FolderFactory, FolderSaved, FoldersUseCases } from '@modules/study'
import { Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	folders: ref<FolderEntity[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		const { id } = useAuth()
		return await FoldersUseCases.listenToUserFolders(id.value, {
			created: async (entity) => {
				Logic.addToArray(
					store.folders.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				Logic.addToArray(
					store.folders.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				store.folders.value = store.folders.value.filter((m) => m.id !== entity.id)
			},
		})
	}),
}

export const useMyFolders = () => {
	const { id } = useAuth()

	const fetchFolders = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const folders = await FoldersUseCases.getUserFolders(id.value)
			folders.results.forEach((r) =>
				Logic.addToArray(
					store.folders.value,
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
		if (/* !store.fetched.value &&  */ !store.loading.value) await fetchFolders()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const saveItem = async (id: string, data: { type: FolderSaved; values: string[]; add: boolean }) => {
		try {
			await store.setError('')
			await store.setLoading(true)
			await FoldersUseCases.updateProp(id, data)
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	return { ...store, saveItem }
}

export const useEditFolder = () => {
	const factory = new FolderFactory()
	const { setLoading } = useLoadingHandler()
	const { setError } = useErrorHandler()
	const route = useRoute()

	const edit = (folder: FolderEntity) => {
		factory.loadEntity(folder)
	}

	const saveFolder = async () => {
		const id = factory.entityId
		if (!id || !factory.valid) return factory.reset()
		try {
			await setError('')
			await setLoading(true)
			await FoldersUseCases.update(id, factory)
			factory.reset()
		} catch (e) {
			await setError(e)
		}
		await setLoading(false)
	}

	const deleteFolder = async (folder: FolderEntity) => {
		const confirmed = await Logic.Common.confirm({
			title: 'Are you sure?',
			sub: 'This action is permanent. All items in the folder will be removed',
			right: { label: 'Yes, delete' },
		})
		if (!confirmed) return
		try {
			await setError('')
			await setLoading(true)
			await FoldersUseCases.delete(folder.id)
			if (factory.entityId === folder.id) factory.reset()
			if (`/library/folders/${folder.id}` === route.path) await Logic.Common.GoToRoute('/library')
		} catch (e) {
			await setError(e)
		}
		await setLoading(false)
	}

	const generateNewFolder = async () => {
		const factory = new FolderFactory()
		factory.title = `New folder (${Logic.getRandomValue()})`
		try {
			await setError('')
			await setLoading(true)
			const folder = await FoldersUseCases.add(factory)
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
