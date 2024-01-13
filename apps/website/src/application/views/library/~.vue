<template>
	<div />
</template>

<script lang="ts">
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Library404',
	beforeRouteEnter: generateMiddlewares([async () => '/library/quizzes']),
})
</script>
