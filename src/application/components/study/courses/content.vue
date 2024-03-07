<template>
	<div
		v-if="SingleCourse"
		class="w-full px-4 relative md:py-4 bg-white mdlg:!rounded-[16px] overflow-y-auto flex-grow max-h-full h-fit flex flex-col gap-4 mdlg:min-h-[400px]">
		<template v-if="isUnlocked">
			<div class="w-full flex flex-col items-start justify-start">
				<SofaHeaderText customClass="!font-bold !text-lg" :content="selectedMaterial?.name" />
			</div>
			<template v-if="selectedMaterial?.type == 'quiz'">
				<SofaEmptyState
					title="Test yourself"
					subTitle="Evaluate your level of knowledge"
					actionLabel="Start"
					:action="() => openMaterial(selectedMaterial.original, true)"
					:icon="{
						name: 'test-white',
						size: 'h-[40px]',
					}"
					titleStyle="mdlg:!text-xl " />
			</template>

			<template v-if="selectedMaterial?.type == 'document'">
				<SofaDocumentReader
					:key="selectedMaterial.id"
					:documentUrl="selectedMaterial.data.documentUrl"
					class="h-[calc(100%-90px)] mdlg:!h-full" />
			</template>

			<template v-if="selectedMaterial?.type == 'image'">
				<div class="w-full flex flex-col">
					<SofaImageLoader
						:key="selectedMaterial.id"
						customClass="w-full h-[400px] rounded-[12px]"
						:photoUrl="selectedMaterial.data.imageUrl" />
				</div>
			</template>

			<template v-if="selectedMaterial?.type == 'video'">
				<div class="w-full flex flex-col">
					<SofaVideoPlayer
						:key="selectedMaterial.id"
						:videoUrl="selectedMaterial.data.videoUrl"
						:type="selectedMaterial.details.media.type" />
				</div>
			</template>
		</template>
		<template v-else>
			<div class="w-full flex flex-col">
				<SofaEmptyState
					title="You have no access"
					subTitle="Get this course to start learning with it"
					customClass="h-[380px]"
					:actionLabel="`${SingleCourse.price.amount ? 'Buy' : 'Get'} ${
						SingleCourse.price.amount
							? Logic.Common.formatPrice(SingleCourse.price.amount, SingleCourse.price.currency)
							: 'for free'
					}`"
					:action="buyCourse"
					:icon="{ name: 'lock-white', size: 'h-[28px]' }"
					titleStyle="mdlg:!text-xl" />
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { extractResource, openMaterial } from '@app/composables/library'
import { Logic } from 'sofa-logic'

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
			openMaterial,
			extractResource,
			SingleCourse,
		}
	},
})
</script>
