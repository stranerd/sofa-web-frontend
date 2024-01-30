<template>
	<LibraryLayout title="Library" :index="true" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { Logic } from 'sofa-logic'

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
