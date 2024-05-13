import { computed } from 'vue'
import { Refable, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'
import { FilesUseCases } from '@modules/study'

export const useFilesInList = (ids: Refable<string[]>, listen = true) => {
	const allFiles = computed(() => [])

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

	const { items: files, addToList } = useItemsInList(
		'files',
		ids,
		allFiles,
		(ids) => FilesUseCases.getInList(ids),
		listen ? listener : undefined,
	)

	return { files }
}
