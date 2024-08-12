<template>
	<LibraryLayout title="Library" :index="true" />
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'LibraryIndexPage',
	routeConfig: { middlewares: ['isAuthenticated', () => ($screen.desktop ? '/library/quizzes' : undefined)] },
	setup() {
		useHead({
			title: 'Library',
		})
	},
})
</script>
