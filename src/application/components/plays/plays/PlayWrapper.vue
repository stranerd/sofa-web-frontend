<template>
	<slot v-if="fetched && play" :play="play" :participants="participants" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { usePlay } from '@app/composables/plays/plays'

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

const { play, participants, questions, fetched, answer, start, end, join, submitAnswer } = usePlay(props.id, {
	questions: props.skipQuestions,
	participants: props.skipParticipants,
	statusNav: props.skipStatusNav,
})
const { id: authId } = useAuth()

const extras = computed(() => ({
	isMine: play.value && play.value.user.id === authId.value,
	canStart: play.value && play.value.user.id === authId.value && play.value.canStart,
	canEnd: play.value && play.value.user.id === authId.value && play.value.canEnd,
	canJoin: play.value && !play.value.participants.includes(authId.value),
	authId: authId.value,
	answers: answer.value?.data ?? null,
	start,
	end,
	join,
	submit: submitAnswer,
	isParticipant: play.value?.participants.includes(authId.value),
	get scores() {
		const p = play.value
		if (!p) return []
		return p.scores
			.map((res, i, scores) => ({
				score: res.value,
				percentage: play.value?.getPercentage(res.userId) ?? 0,
				position: scores[i - 1]?.value === res.value ? '' : (i + 1).toString(),
				user: participants.value.find((p) => p.id === res.userId)!,
				isWinner: scores[0]?.value === res.value,
				label: p.getResultLabel(authId.value),
				color: p.getResultColor(authId.value),
				bgColor: p.getResultColor(authId.value).split(']')[0].split('[')[1],
			}))
			.filter((res) => !!res.user)
	},
}))
</script>
