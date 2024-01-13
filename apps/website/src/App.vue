<template>
	<metainfo>
		<template #title="{ content }">
			{{ content ? `${content} | SOFA` : `SOFA` }}
		</template>
	</metainfo>
	<router-view :key="$route.path" />
	<!-- Report material -->
	<rate-and-review-modal
		v-if="reportMaterialSetup.show"
		:close="() => (reportMaterialSetup.show = false)"
		:can-close="true"
		:has-ratings="false"
		:title="`Report this ${reportMaterialSetup.type}`"
		@on-review-submitted="sendReportMaterial" />
	<Modals />
</template>

<script lang="ts" setup>
import RateAndReviewModal from '@/components/common/RateAndReviewModal.vue'
import Modals from '@/components/core/modals/Modals.vue'
import { useAuth } from '@/composables/auth/auth'
import { reportMaterialSetup, sendReportMaterial } from '@/composables/library'
import { UsersUseCases } from '@modules/users'
import { watch } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

useMeta({
	title: 'SOFA',
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
		if (!path.startsWith(`/quiz/${quizzes.id}/edit`)) UsersUseCases.updateEditingQuizzes(null).catch()
	},
	{ immediate: true },
)
</script>
