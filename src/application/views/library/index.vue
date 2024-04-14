<template>
	<LibraryLayout title="Library" :index="true" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'LibraryPage',
	routeConfig: { middlewares: ['isAuthenticated', () => (Logic.Screen.desktop ? '/library/quizzes' : undefined)] },
	setup() {
		useMeta({
			title: 'Library',
		})
	},
})
</script>
