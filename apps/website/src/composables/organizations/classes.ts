import { ClassFactory, ClassesUseCases } from '@modules/organizations'
import { useAsyncFn } from '../core/hooks'

export const useCreateClass = (organizationId: string) => {
	const factory = new ClassFactory()

	const {
		asyncFn: createClass,
		loading,
		error,
	} = useAsyncFn(async () => {
		await ClassesUseCases.add(organizationId, factory)
		factory.reset()
	})

	return { error, loading, factory, createClass }
}
