<template>
	<LibraryLayout title="Library" :index="true" />
</template>

<script lang="ts">
import LibraryLayout from '@/components/study/LibraryLayout.vue'
import { Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'LibraryPage',
	components: { LibraryLayout },
	routeConfig: { middlewares: ['isAuthenticated', () => (Logic.Common.isLarge ? '/library/quizzes' : undefined)] },
	setup() {
		useMeta({
			title: 'Library',
		})
	},
})
</script>
