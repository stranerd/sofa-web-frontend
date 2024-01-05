<template>
	<div />
</template>

<script lang="ts">
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'TestsIdIndexPage',
	beforeRouteEnter: generateMiddlewares([async ({ to }) => `/tests/${to.params.id}/lobby`]),
})
</script>
