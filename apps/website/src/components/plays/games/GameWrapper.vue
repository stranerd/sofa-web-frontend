<template>
	<slot v-if="fetched && game" :game="game" :participants="participants" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useGame } from '@/composables/plays/games'
import { Logic } from 'sofa-logic'
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	skipQuestions: {
		type: Boolean,
		required: false,
		default: false,
	},
	skipParticipants: {
		type: Boolean,
		required: false,
		default: false,
	},
	skipStatusNav: {
		type: Boolean,
		required: false,
		default: false,
	},
})

const router = useRouter()
const { game, participants, questions, fetched, answer, start, end, join, submitAnswer } = useGame(props.id, {
	questions: props.skipQuestions,
	participants: props.skipParticipants,
	statusNav: props.skipStatusNav,
})
const { id: authId } = useAuth()

const extras = computed(() => ({
	isMine: game.value && game.value.user.id === authId.value,
	canStart: game.value && game.value.status === 'created',
	canEnd: game.value && game.value.user.id === authId.value && game.value.status === 'started',
	canJoin: game.value && !game.value.participants.includes(authId.value),
	authId: authId.value,
	answers: answer.value?.data ?? null,
	start,
	end,
	join,
	submit: async (data?: { questionId: string; answer: any }) => {
		if (data) return await submitAnswer(data)
		await router.push(`/games/${props.id}/results`)
		return true
	},
	isParticipant: game.value?.participants.includes(authId.value),
	get scores() {
		return Object.entries(game.value.scores ?? {})
			.sort((a, b) => b[1] - a[1])
			.map((res, i, orgArr) => ({
				score: res[1],
				percentage: Logic.formatNumber((res[1] / game.value.questions.length) * 10, 1),
				position: orgArr[i - 1]?.[1] === res[1] ? '' : (i + 1).toString(),
				user: participants.value.find((p) => p.id === res[0]),
				isWinner: orgArr[0]?.[1] === res[1],
			}))
			.filter((res) => !!res.user)
	},
}))
</script>
