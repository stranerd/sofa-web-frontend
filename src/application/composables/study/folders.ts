import { addToArray, getRandomValue } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { createStore } from '../core/store'
import { FolderEntity, FolderFactory, FolderSaved, FoldersUseCases, StudyMaterial } from '@modules/study'

export const saveToFolder = (entity: StudyMaterial) => {
	useModals().study.saveToFolder.open({ entity })
}

const store = createStore(
	{
		folders: ref<FolderEntity[]>([]),
		listener: useListener(async () => {
			const { id } = useAuth()
			return await FoldersUseCases.listenToUserFolders(id.value, {
				created: async (entity) => {
					addToArray(
						store.folders.value,
						entity,
						(e) => e.id,
						(e) => e.createdAt,
					)
				},
				updated: async (entity) => {
					addToArray(
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
	},
	'study/folders/mine',
)

export const useMyFolders = () => {
	const { id } = useAuth()

	const {
		asyncFn: fetchFolders,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const folders = await FoldersUseCases.getUserFolders(id.value)
			folders.results.forEach((r) =>
				addToArray(
					store.folders.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: 'study/folders/mine' },
	)

	onMounted(async () => {
		if (!id.value) return
		if (!called.value) await fetchFolders()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	const { asyncFn: saveItem } = useAsyncFn(async (id: string, data: { type: FolderSaved; propIds: string[]; add: boolean }) => {
		await FoldersUseCases.updateProp(id, data)
	})

	return { ...store, loading, error, saveItem }
}

export const useEditFolder = () => {
	const factory = new FolderFactory()
	const route = useRoute()
	const router = useRouter()

	const edit = (folder: FolderEntity) => {
		factory.loadEntity(folder)
	}

	const { asyncFn: saveFolder } = useAsyncFn(async () => {
		const id = factory.entityId
		if (!id || !factory.valid) return factory.reset()
		await FoldersUseCases.update(id, factory)
		factory.reset()
	})

	const { asyncFn: deleteFolder } = useAsyncFn(
		async (folder: FolderEntity) => {
			await FoldersUseCases.delete(folder.id)
			if (factory.entityId === folder.id) factory.reset()
			if (`/library/folders/${folder.id}` === route.path) await router.push('/library')
		},
		{
			pre: async () =>
				await $utils.confirm({
					title: 'Are you sure?',
					sub: 'This action is permanent. All items in the folder will be removed',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	const { asyncFn: generateNewFolder } = useAsyncFn(async () => {
		const factory = new FolderFactory()
		factory.title = `New folder (${getRandomValue()})`
		const folder = await FoldersUseCases.add(factory)
		edit(folder)
	})

	return { factory, edit, saveFolder, generateNewFolder, deleteFolder }
}

export const useFolder = (id: string) => {
	const folderList = useMyFolders()

	const folder = computed(() => store.folders.value.find((q) => q.id === id) ?? null)

	return { ...folderList, folder }
}
