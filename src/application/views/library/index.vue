<template>
	<LibraryLayout title="Library" :index="true" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'LibraryIndexPage',
	routeConfig: { middlewares: ['isAuthenticated', () => ($screen.desktop ? '/library/quizzes' : undefined)] },
	setup() {
		useMeta({
			title: 'Library',
		})
	},
})
</script>
