import { useAsyncFn } from '../core/hooks'
import { FileEntity, FileFactory, FilesUseCases } from '@modules/study'
import { Logic } from 'sofa-logic'

export const useCreateFile = () => {
	const factory = new FileFactory()

	const {
		asyncFn: createFile,
		loading,
		error,
	} = useAsyncFn(async () => {
		const file = await FilesUseCases.add(factory)
		factory.reset()
		return file
	})

	return { createFile, error, loading }
}

export const useUpdateFile = (file: FileEntity) => {
	const factory = new FileFactory()
	factory.loadEntity(file)

	const {
		asyncFn: updateFile,
		loading,
		error,
	} = useAsyncFn(async () => {
		const updatedFile = await FilesUseCases.update(file.id, factory)
		factory.reset()
		return updatedFile
	})

	return { updateFile, error, loading }
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
