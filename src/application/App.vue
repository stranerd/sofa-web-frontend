<template>
	<metainfo>
		<template #title="{ content }">
			{{ content ? `${content} | Stranerd` : 'Stranerd' }}
		</template>
	</metainfo>
	<RouterView :key="$route.path" />
	<Modals />
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useMeta } from 'vue-meta'
import Modals from '@app/components/core/modals/Modals.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useRoute } from '@app/composables/core/routes'
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
		if (!path.startsWith(`/study/quizzes/${quizzes.id}/edit`)) UsersUseCases.updateEditingQuizzes(null).catch()
	},
	{ immediate: true },
)
</script>
