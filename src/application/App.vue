<template>
	<RouterView :key="$route.path" />
	<Modals />
</template>

<script lang="ts" setup>
import { useHead } from '@unhead/vue'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import Modals from '@app/components/core/modals/Modals.vue'
import { useAuth } from '@app/composables/auth/auth'
import { UsersUseCases } from '@modules/users'

useHead({
	title: 'Stranerd',
	htmlAttrs: { lang: 'en' /* amp: true */ },
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
