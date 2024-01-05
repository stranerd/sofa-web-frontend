<template>
	<div />
</template>

<script lang="ts">
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'GamesIdIndexPage',
	beforeRouteEnter: generateMiddlewares([async ({ to }) => `/games/${to.params.id}/lobby`]),
})
</script>
