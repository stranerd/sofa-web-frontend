<template>
	<slot v-if="fetched && play" :play="play" :quiz="quiz" :participants="participants" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { usePlay } from '@app/composables/plays/plays'
import { useQuizzesInList } from '@app/composables/study/quizzes-list'
import { PlayTypes } from '@modules/plays'
import { ordinalSuffixOf } from '@utils/commons'
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

const { id: authId } = useAuth()
const { play, participants, questions, fetched, myAnswer, start, end, join, submitAnswer, resetAnswer } = usePlay(props.type, props.id, {
	questions: props.skipQuestions,
	participants: props.skipParticipants,
	statusNav: props.skipStatusNav,
})
const { quizzes } = useQuizzesInList(computed(() => (play.value ? [play.value.quizId] : [])))
const quiz = computed(() => quizzes.value.at(0) ?? null)

const extras = computed(() => ({
	isMine: play.value && play.value.user.id === authId.value,
	isParticipant: play.value?.participants.includes(authId.value),
	canStart: play.value && play.value.user.id === authId.value && play.value.isCreated,
	canEnd: play.value && play.value.user.id === authId.value && play.value.isStarted,
	canJoin: play.value && !play.value.participants.includes(authId.value),
	authId: authId.value,
	picture: quiz.value?.picture ?? '/images/default.svg',
	answers: myAnswer.value?.allAnswers ?? {},
	startQuiz: async () => {
		if (!myAnswer.value) await submitAnswer({ questionId: null, answer: null }, false)
		return myAnswer.value?.timedOutAt ?? null
	},
	start,
	end,
	join,
	submitAnswer,
	resetAnswer,
	share: async () => {
		if (play.value)
			await Logic.Common.share(
				`Join ${play.value.singularizedType} on SOFA`,
				`Take a quiz on: ${play.value.title}`,
				play.value.shareLink,
			)
	},
	copy: async () => {
		if (play.value) await Logic.Common.copy(play.value.shareLink)
	},
	get scores() {
		const p = play.value
		if (!p) return []
		return p.scores
			.map((res, i, scores) => ({
				score: res.value,
				percentage: play.value?.getPercentage(res.userId) ?? 0,
				position: scores[i - 1]?.value === res.value ? '' : ordinalSuffixOf(i + 1),
				user: participants.value.find((p) => p.id === res.userId)!,
				isWinner: scores[0]?.value === res.value,
				label: p.getResultLabel(authId.value),
				color: p.getResultColor(authId.value),
				bgColor: p.getResultColor(authId.value).split(']')[0].split('[')[1],
				correct: Math.round(res.value * p.questions.length),
			}))
			.filter((res) => !!res.user)
	},
	get myScore() {
		return this.scores.find((s) => s.user.id === authId.value)
	},
}))
</script>
