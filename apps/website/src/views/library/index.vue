<template>
	<LibraryLayout title="Library" :index="true" />
</template>

<script lang="ts">
import LibraryLayout from '@/components/library/LibraryLayout.vue'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	components: { LibraryLayout },
	name: 'LibraryPage',
	beforeRouteEnter: generateMiddlewares(['isAuthenticated', async () => (Logic.Common.isLarge ? '/library/quizzes' : undefined)]),
	setup() {
		useMeta({
			title: 'Library',
		})
	},
})
</script>
