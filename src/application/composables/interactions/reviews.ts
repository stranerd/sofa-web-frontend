import { addToArray } from 'valleyed'
import { Ref, computed, onMounted, onUnmounted, ref } from 'vue'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { createStore } from '../core/store'
import { Interaction, ReviewEntity, ReviewFactory, ReviewsUseCases } from '@modules/interactions'
import { useSuccessHandler } from '@app/composables/core/states'

const store = createStore(
	<
		Record<
			string,
			{
				reviews: Ref<ReviewEntity[]>
				listener: ReturnType<typeof useListener>
			}
		>
	>{},
	'interactions/reviews',
)

export const useReviews = (interaction: Interaction) => {
	const key = `${interaction.type}-${interaction.id}`

	store[key] ??= {
		reviews: ref([]),
		listener: useListener(
			async () =>
				await ReviewsUseCases.listenForEntity(interaction, {
					created: async (entity) => {
						addToArray(
							store[key].reviews.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					updated: async (entity) => {
						addToArray(
							store[key].reviews.value,
							entity,
							(e) => e.id,
							(e) => e.createdAt,
						)
					},
					deleted: async (entity) => {
						store[key].reviews.value = store[key].reviews.value.filter((m) => m.id !== entity.id)
					},
				}),
		),
	}

	const {
		asyncFn: fetchReviews,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const reviews = await ReviewsUseCases.getForEntity(interaction)
			reviews.results.forEach((r) =>
				addToArray(
					store[key].reviews.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `interactions/reviews/${key}` },
	)

	const stats = computed(() => {
		const combined = store[key].reviews.value.reduce(
			(acc, review) => {
				const rating = Math.round(review.rating)
				acc[rating] = (acc[rating] || 0) + 1
				return acc
			},
			{ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
		)
		const totalReviews = store[key].reviews.value.length
		return Object.fromEntries(Object.entries(combined).map(([rating, count]) => [rating, { count, percentage: count / totalReviews }]))
	})

	onMounted(async () => {
		if (!called.value) await fetchReviews()
		await store[key].listener.start()
	})

	onUnmounted(async () => {
		await store[key].listener.start()
	})

	return { ...store[key], stats, loading, error }
}

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
