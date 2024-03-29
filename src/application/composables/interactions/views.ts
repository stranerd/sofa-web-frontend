import { useAsyncFn } from '../core/hooks'
import { Interaction, ViewsUseCases } from '@modules/interactions'

export const useCreateView = () => {
	const {
		asyncFn: createView,
		loading,
		error,
	} = useAsyncFn(
		async (interaction: Interaction) => {
			await ViewsUseCases.add(interaction)
			return true
		},
		{ hideError: true, hideLoading: true },
	)

	return { error, loading, createView }
}
