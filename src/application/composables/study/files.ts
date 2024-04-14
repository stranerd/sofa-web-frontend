import { Refable, useAsyncFn } from '../core/hooks'
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

	return { factory, createFile, error, loading }
}

export const useUpdateFile = (file: Refable<FileEntity | null>) => {
	const factory = new FileFactory()
	if (file.value) factory.loadEntity(file.value)

	const {
		asyncFn: updateFile,
		loading,
		error,
	} = useAsyncFn(async () => {
		if (!file.value) return
		const updatedFile = await FilesUseCases.update(file.value.id, factory)
		factory.loadEntity(updatedFile)
		return updatedFile
	})

	return { factory, updateFile, error, loading }
}

export const useDeleteFile = () => {
	const {
		asyncFn: deleteFile,
		loading,
		error,
	} = useAsyncFn(
		async (file: FileEntity) => {
			await FilesUseCases.delete(file.id)
			return true
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
