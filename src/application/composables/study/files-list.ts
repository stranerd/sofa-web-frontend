import { FilesUseCases } from '@modules/study'
import { computed, onMounted, onUnmounted } from 'vue'
import { Refable, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'

export const useFilesInList = (ids: Refable<string[]>, listen = false) => {
	const allFiles = computed(() => [])
	const { items: files, addToList } = useItemsInList('files', ids, allFiles, (ids) => FilesUseCases.getInList(ids))

	const listener = useListener(
		async () =>
			await FilesUseCases.listenToInList(() => ids.value, {
				created: addToList,
				updated: addToList,
				deleted: () => {
					/* */
				},
			}),
	)

	onMounted(() => {
		if (listen) listener.start()
	})

	onUnmounted(() => {
		if (listen) listener.close()
	})

	return { files }
}
