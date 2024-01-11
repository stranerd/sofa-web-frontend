import { ClassFactory, ClassesUseCases } from '@modules/organizations'
import { useErrorHandler, useLoadingHandler } from '../core/states'

export const useCreateClass = (organizationId: string) => {
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const factory = new ClassFactory()

	const createClass = async () => {
		await setError('')
		if (!loading.value) {
			try {
				await setLoading(true)
				await ClassesUseCases.add(organizationId, factory)
				factory.reset()
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		}
	}

	return { error, loading, factory, createClass }
}
