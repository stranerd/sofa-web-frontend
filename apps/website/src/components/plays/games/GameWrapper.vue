<template>
	<slot v-if="fetched && game" :game="game" :participants="participants" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useGame } from '@/composables/plays/games'
import { Logic } from 'sofa-logic'
import { computed, defineProps, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
const {
	game, participants, questions, fetched, answer,
	start, join, submitAnswer
} = useGame(props.id, { questions: props.skipQuestions, participants: props.skipParticipants })
const { id } = useAuth()

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

const extras = computed(() => ({
	isMine: game.value && game.value.user.id === id.value,
	canStart: game.value && game.value.status === 'created',
	canJoin: game.value && !game.value.participants.includes(id.value),
	authId: id.value,
	answers: answer.value?.data ?? null,
	start, join,
	submit: async (data?: { questionId: string, answer: any }) => {
		if (data) return await submitAnswer(data)
		await router.push(`/games/${id}/results`)
		return true
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
}))

watch(game, gameWatcherCb)
gameWatcherCb()
</script>