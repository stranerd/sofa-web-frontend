<template>
	<slot v-if="fetched && game" :game="game" :participants="participants" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useGame } from '@/composables/plays/games'
import { Logic } from 'sofa-logic'
import { computed, defineProps, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuestionDisplay from '@/components/quizzes/QuestionDisplay.vue'

const props = defineProps({
	id: {
		type: String,
		required: true
	},
	skipQuestions: {
		type: Boolean,
		required: false,
		default: false
	},
	skipParticipants: {
		type: Boolean,
		required: false,
		default: false
	},
	skipStatusNav: {
		type: Boolean,
		required: false,
		default: false
	}
})

const router = useRouter()
const route = useRoute()
const { game, participants, questions, fetched, start, join } = useGame(props.id, { questions: props.skipQuestions, participants: props.skipParticipants })
const { id } = useAuth()

const index = ref(0)
const answers = reactive<Record<string, any>>({})
const currentQuestion = computed(() => questions.value.at(index.value))
const answer = computed({
	get: () => currentQuestion.value ? answers[currentQuestion.value.id] ?? Logic.Study.transformQuestion(currentQuestion.value).defaultAnswer : [],
	set: (val) => {
		answers[currentQuestion.value?.id] = val
	}
})

const alertAndNav = async (route: string, message?: string) => {
	if (message) Logic.Common.showLoader({ show: true, message, type: 'info' })
	await router.replace(route)
}

const gameWatcherCb = async () => {
	const g = game.value
	if (!g || props.skipStatusNav) return
	const lobby = `/games/${g.id}/lobby`
	const run = `/games/${g.id}/run`
	const results = `/games/${g.id}/results`

	if (g.status === 'created' && route.path !== lobby) return await alertAndNav(lobby)
	if (g.status === 'started' && route.path !== run) return await alertAndNav(run, 'Game has started')
	if (['ended', 'scored'].includes(g.status) && route.path !== results) return await alertAndNav(results, 'Game has ended')
}

const optionState: InstanceType<typeof QuestionDisplay>['$props']['optionState'] = (val, index) => {
	const question = currentQuestion.value
	if (!question) return null
	if (question.strippedData.type === 'trueOrFalse' && answer.value === val) return 'selected'
	if (question.strippedData.type === 'multipleChoice' && answer.value.includes(index)) return 'selected'
	return null
}

const extras = computed(() => ({
	isMine: game.value && game.value.user.id === id.value,
	canStart: game.value && game.value.status === 'created',
	canJoin: game.value && !game.value.participants.includes(id.value),
	authId: id.value,
	start, join, optionState,
	set index (v) {
		//
	},
	get index () {
		return index.value
	},
	get answer () {
		return answer.value
	},
	set answer (v) {
		answer.value = v
	},
	isParticipant: game.value?.participants.includes(id.value),
	get scores () {
		return Object.entries(game.value.scores ?? {})
			.sort((a, b) => b[1] - a[1])
			.map((res, i, orgArr) => ({
				score: res[1],
				position: orgArr[i - 1]?.[1] === res[1] ? '' : (i + 1).toString(),
				user: participants.value.find((p) => p.id === res[0]),
				isWinner: orgArr[0]?.[1] === res[1],
			}))
			.filter((res) => !!res.user)
	},
	async continue () {
		//
	}
}))

watch(game, gameWatcherCb)
gameWatcherCb()
</script>