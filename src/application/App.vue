<template>
	<metainfo>
		<template #title="{ content }">
			{{ content ? `${content} | Stranerd` : 'Stranerd' }}
		</template>
	</metainfo>
	<router-view :key="$route.path" />
	<Modals />
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import Modals from '@app/components/core/modals/Modals.vue'
import { useAuth } from '@app/composables/auth/auth'
import { UsersUseCases } from '@modules/users'

useMeta({
	title: 'Stranerd',
	htmlAttrs: { lang: 'en', amp: true },
})

const route = useRoute()
const { user } = useAuth()

watch(
	[route, user],
	async () => {
		const path = route.fullPath
		const quizzes = user.value?.account.editing?.quizzes
		if (!quizzes) return
		if (!path.startsWith(`/quizzes/${quizzes.id}/edit`)) UsersUseCases.updateEditingQuizzes(null).catch()
	},
	{ immediate: true },
)
</script>
