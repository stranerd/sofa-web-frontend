<template>
	<ExpandedLayout width="mdlg:!w-[85%] lg:!w-[75%]" layoutStyle="mdlg:py-4" :hide="{ bottom: true }">
		<div class="mdlg:flex hidden justify-between items-center w-full">
			<SofaText class="text-grayColor w-full flex justify-start gap-1">
				<router-link to="/marketplace">Marketplace</router-link>
				<span> / {{ quiz?.title }}</span>
			</SofaText>
		</div>
		<div class="w-full flex mdlg:hidden items-center z-10 gap-3 justify-between bg-lightGray p-4 sticky top-0">
			<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
			<SofaHeading content="Quiz Details" />
			<span class="w-4" />
		</div>
		<ContentDetails v-if="quiz" :material="quiz" class="w-full bg-white mdlg:rounded-2xl grow overflow-y-auto" />
	</ExpandedLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useQuiz } from '@app/composables/study/quizzes'
import ContentDetails from '@app/components/study/ContentDetails.vue'

export default defineComponent({
	name: 'MarketplaceQuizzesIdPage',
	components: { ContentDetails },
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useHead({
			title: 'Quiz Details',
		})

		const route = useRoute()
		const { quiz } = useQuiz(route.params.id as string, { members: true, questions: true })
		return { quiz }
	},
})
</script>
