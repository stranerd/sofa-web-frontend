<template>
	<template v-if="fetched && play">
		<slot
			v-if="play.canJoinAfterStart && play.isStarted && extras.canJoin"
			name="joinPostStart"
			:play="play"
			:participants="participants"
			:questions="questions"
			:extras="extras" />
		<slot v-else :play="play" :participants="participants" :questions="questions" :extras="extras" />
	</template>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { usePlay } from '@app/composables/plays/plays'
import { PlayTypes } from '@modules/plays'
import { QuizEntity } from '@modules/study'
import { Logic } from 'sofa-logic'

const props = withDefaults(
	defineProps<{
		id: string
		type: PlayTypes
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

const { play, participants, questions, fetched, myAnswer, start, end, join, submitAnswer, resetAnswer } = usePlay(props.type, props.id, {
	questions: props.skipQuestions,
	participants: props.skipParticipants,
	statusNav: props.skipStatusNav,
})
const { id: authId } = useAuth()

const extras = computed(() => ({
	isMine: play.value && play.value.user.id === authId.value,
	canStart: play.value && play.value.user.id === authId.value && play.value.isCreated,
	canEnd: play.value && play.value.user.id === authId.value && play.value.isStarted,
	canJoin: play.value && !play.value.participants.includes(authId.value),
	authId: authId.value,
	answers: myAnswer.value?.allAnswers ?? {},
	start,
	end,
	join,
	submitAnswer,
	resetAnswer,
	share: async (quiz: QuizEntity) => {
		if (play.value)
			await Logic.Common.share(`Join ${play.value.singularizedType} on SOFA`, `Take a quiz on: ${quiz.title}`, play.value.shareLink)
	},
	copy: async () => {
		if (play.value) await Logic.Common.copy(play.value.shareLink)
	},
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
