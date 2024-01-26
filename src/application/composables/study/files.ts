import { FileEntity, FileFactory, FilesUseCases } from '@modules/study'
import { Logic } from 'sofa-logic'
import { useAsyncFn } from '../core/hooks'

export const useCreateFile = () => {
	const {
		asyncFn: createFile,
		loading,
		error,
	} = useAsyncFn(async () => {
		const factory = new FileFactory()
		const file = await FilesUseCases.add(factory)
		return file
	})

	return { createFile, error, loading }
}

export const useDeleteFile = () => {
	const {
		asyncFn: deleteFile,
		loading,
		error,
	} = useAsyncFn(
		async (file: FileEntity) => {
			await FilesUseCases.delete(file.id)
		},
		{
			pre: async () =>
				await Logic.Common.confirm({
					title: 'Are you sure?',
					sub: 'This action is permanent.',
					right: { label: 'Yes, delete' },
				}),
		},
	)

	return { deleteFile, error, loading }
}
