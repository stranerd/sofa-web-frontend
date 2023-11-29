<template>
	<slot v-if="fetched && game" :game="game" :participants="participants" />
</template>

<script lang="ts" setup>
import { useGame } from '@/composables/plays/games'
import { defineProps } from 'vue'

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

const { game, participants, fetched } = useGame(props.id, props.skipQuestions)
</script>