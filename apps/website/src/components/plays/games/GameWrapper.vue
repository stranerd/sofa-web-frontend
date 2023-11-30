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
	start, join
}))
</script>