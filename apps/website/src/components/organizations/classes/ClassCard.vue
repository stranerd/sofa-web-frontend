<template>
	<div class="bg-white shadow-custo rounded-custom p-4 relative">
		<div class="flex flex-row items-center gap-2 mdlg:gap-4 w-full">
			<sofa-image-loader
				:photo-url="classObj.picture"
				custom-class="!h-[100px] !w-[150px] mdlg:!h-[115px] w-full mdlg:!w-[200px] bg-grayColor rounded-custom relative">
			</sofa-image-loader>
			<div class="flex flex-col gap-2 relative h-full w-full">
				<sofa-normal-text :custom-class="'!font-bold w-full text-left !line-clamp-1'">{{ classObj.title }}</sofa-normal-text>
				<div v-show="type === 'teacher'" class="flex items-center gap-1">
					<sofa-icon name="notebook-black" custom-class="h-[16px]" />
					<sofa-normal-text color="text-deepGray">
						{{ 'N/A' }}
					</sofa-normal-text>
				</div>
				<sofa-normal-text v-show="type === 'teacher'" color="text-grayColor">
					{{ 0 }}
				</sofa-normal-text>
				<div v-show="type === 'org'" class="flex items-center gap-2">
					<sofa-normal-text color="text-grayColor">
						{{ 0 }}
					</sofa-normal-text>
					<div class="w-[5px] h-[5px] bg-grayColor rounded-[50%]"></div>
					<sofa-normal-text color="text-grayColor">
						{{ 0 }}
					</sofa-normal-text>
				</div>
				<sofa-normal-text v-show="type === 'org'" color="text-grayColor" size="lg" custom-class="font-bold">
					{{ '₦' + classObj.price.amount.toLocaleString() }}
				</sofa-normal-text>
			</div>
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { SofaIcon, SofaNormalText, SofaImageLoader } from 'sofa-ui-components'
import { ClassEntity } from 'sofa-modules/src/modules/organizations'

export default defineComponent({
	name: 'ClassCard',
	components: { SofaNormalText, SofaIcon, SofaImageLoader },
	props: {
		classObj: {
			type: Object as PropType<ClassEntity>,
			required: true,
		},
		type: {
			type: String,
			required: true,
			default: 'teacher',
		},
	},
	setup() {
		return {}
	},
})
</script>
