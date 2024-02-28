<template>
	<slot v-if="fetched && game" :game="game" :participants="participants" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { formatNumber } from 'valleyed'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlay } from '@app/composables/plays/plays'
import { useAuth } from '@app/composables/auth/auth'

const props = withDefaults(
	defineProps<{
		id: string
		skipQuestions?: boolean
		skipParticipants?: boolean
		skipStatusNav?: boolean
	}>(),
	{
		skipQuestions: false,
		skipParticipants: false,
		skipStatusNav: false,
	},
)

const router = useRouter()
const {
	play: game,
	participants,
	questions,
	fetched,
	answer,
	start,
	end,
	join,
	submitAnswer,
} = usePlay(props.id, {
	questions: props.skipQuestions,
	participants: props.skipParticipants,
	statusNav: props.skipStatusNav,
})
const { id: authId } = useAuth()

const extras = computed(() => ({
	isMine: game.value && game.value.user.id === authId.value,
	canStart: game.value && game.value.user.id === authId.value && game.value.canStart,
	canEnd: game.value && game.value.user.id === authId.value && game.value.canEnd,
	canJoin: game.value && !game.value.participants.includes(authId.value),
	authId: authId.value,
	answers: answer.value?.data ?? null,
	start,
	end,
	join,
	submit: async (data?: { questionId: string; answer: any }) => {
		if (!game.value) return
		if (data) return await submitAnswer(data)
		await router.push(game.value.resultsPage)
		return true
	},
	isParticipant: game.value?.participants.includes(authId.value),
	get scores() {
		const g = game.value
		if (!g) return []
		return g.scores
			.map((res, i, scores) => ({
				score: res.value,
				percentage: formatNumber((res.value / g.questions.length ?? 0) * 10, 1),
				position: scores[i - 1]?.value === res.value ? '' : (i + 1).toString(),
				user: participants.value.find((p) => p.id === res.userId),
				isWinner: scores[0]?.userId === res.userId,
			}))
			.filter((res) => !!res.user)
	},
}))
</script>
