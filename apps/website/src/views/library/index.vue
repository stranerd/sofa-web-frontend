<template>
	<LibraryLayout title="Library" :index="true" />
</template>

<script lang="ts">
import LibraryLayout from '@/components/study/LibraryLayout.vue'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'LibraryPage',
	components: { LibraryLayout },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated', async () => (Logic.Common.isLarge ? '/library/quizzes' : undefined)]),
	setup() {
		useMeta({
			title: 'Library',
		})
	},
})
</script>
