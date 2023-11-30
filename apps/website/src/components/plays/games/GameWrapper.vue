<template>
	<slot v-if="fetched && game" :game="game" :participants="participants" :questions="questions" :extras="extras" />
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useGame } from '@/composables/plays/games'
import { computed, defineProps } from 'vue'

const props = defineProps({
	id: {
		type: String,
		required: true
	},
	skipQuestions: {
		type: Boolean,
		required: false,
		default: false
	}
})

const { game, participants, questions, fetched, start, join } = useGame(props.id, props.skipQuestions)
const { id } = useAuth()

const extras = computed(() => ({
	isMine: game.value && game.value.user.id === id.value,
	canStart: game.value && game.value.status === 'created',
	canJoin: game.value && !game.value.participants.includes(id.value),
	authId: id.value,
	start, join,
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
	}
}))
</script>