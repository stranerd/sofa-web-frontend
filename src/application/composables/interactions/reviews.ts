import { useSuccessHandler } from '@app/composables/core/states'
import { Interaction, ReviewFactory, ReviewsUseCases } from '@modules/interactions'
import { useAsyncFn } from '../core/hooks'

export const useCreateReview = (interaction: Interaction) => {
	const factory = new ReviewFactory()
	const { message, setMessage } = useSuccessHandler()

	const {
		asyncFn: createReview,
		loading,
		error,
	} = useAsyncFn(async (submit?: (factory: ReviewFactory) => Promise<boolean | undefined>) => {
		if (submit) await submit(factory)
		else await ReviewsUseCases.add(interaction, factory)
		factory.reset()
		await setMessage('Submitted successfully')
		return true
	})

	return { factory, error, message, loading, createReview }
}
