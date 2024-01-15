<template>
	<div
		v-if="SingleCourse"
		class="w-full px-4 relative md:py-4 bg-white mdlg:!rounded-[16px] overflow-y-auto flex-grow max-h-full h-fit flex flex-col gap-4 mdlg:min-h-[400px]">
		<template v-if="isUnlocked">
			<div class="w-full flex flex-col items-start justify-start">
				<SofaHeaderText :custom-class="'!font-bold !text-lg'" :content="selectedMaterial?.name" />
			</div>
			<template v-if="selectedMaterial?.type == 'quiz'">
				<SofaEmptyState
					:title="'Test yourself'"
					:sub-title="'Evaluate your level of knowledge'"
					:action-label="'Start'"
					:action="() => openQuiz(extractResource(selectedMaterial.original), true)"
					:icon="{
						name: 'test-white',
						size: 'h-[40px]',
					}"
					:title-style="'mdlg:!text-xl '" />
			</template>

			<template v-if="selectedMaterial?.type == 'document'">
				<div class="w-full mdlg:!h-full flex-grow flex flex-col" style="height: calc(100vh - 90px)">
					<SofaDocumentReader :key="selectedMaterial.id" :document-url="selectedMaterial.data.documentUrl" />
				</div>
			</template>

			<template v-if="selectedMaterial?.type == 'image'">
				<div class="w-full flex flex-col">
					<SofaImageLoader
						:key="selectedMaterial.id"
						:custom-class="'w-full h-[400px] rounded-[12px]'"
						:photo-url="selectedMaterial.data.imageUrl" />
				</div>
			</template>

			<template v-if="selectedMaterial?.type == 'video'">
				<div class="w-full flex flex-col">
					<SofaVideoPlayer
						:key="selectedMaterial.id"
						:video-url="selectedMaterial.data.videoUrl"
						:type="selectedMaterial.details.media.type" />
				</div>
			</template>
		</template>
		<template v-else>
			<div class="w-full flex flex-col">
				<SofaEmptyState
					:title="'You have no access'"
					:sub-title="'Get this course to start learning with it'"
					:custom-class="'h-[380px]'"
					:action-label="`${SingleCourse.price.amount ? 'Buy' : 'Get'} ${
						SingleCourse.price.amount
							? Logic.Common.formatPrice(SingleCourse.price.amount, SingleCourse.price.currency)
							: 'for free'
					}`"
					:action="buyCourse"
					:icon="{ name: 'lock-white', size: 'h-[28px]' }"
					:title-style="'mdlg:!text-xl'" />
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { extractResource, openQuiz } from '@app/composables/library'
import { Logic } from 'sofa-logic'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
	props: {
		isUnlocked: {
			type: Boolean,
			default: false,
		},
		selectedMaterial: {
			type: Object as () => any,
			default: null,
		},
		buyCourse: {
			type: Function,
			default: () => {
				//
			},
		},
	},
	setup() {
		const SingleCourse = ref(Logic.Study.SingleCourse)

		onMounted(() => {
			Logic.Study.watchProperty('SingleCourse', SingleCourse)
		})

		return {
			Logic,
			openQuiz,
			extractResource,
			SingleCourse,
		}
	},
})
</script>
