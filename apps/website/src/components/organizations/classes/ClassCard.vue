<template>
	<div class="bg-white shadow-custo rounded-custom p-4 relative">
		<div class="flex flex-row items-center gap-2 mdlg:gap-4 w-full">
			<sofa-image-loader
				:photo-url="classObj.image"
				custom-class="!h-[100px] !w-[150px] mdlg:!h-[115px] w-full mdlg:!w-[200px]  rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] relative">
			</sofa-image-loader>
			<div class="flex flex-col gap-2 relative h-full w-full">
				<sofa-normal-text :custom-class="'!font-bold w-full text-left !line-clamp-1'">{{ classObj.title }}</sofa-normal-text>
				<div class="flex items-center gap-1">
					<sofa-icon name="notebook-black" custom-class="h-[16px]" />
					<sofa-normal-text color="text-deepGray">
						{{ classObj.course }}
					</sofa-normal-text>
				</div>
				<sofa-normal-text color="text-grayColor">
					{{ classObj.no_of_students }}
				</sofa-normal-text>
			</div>
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SofaIcon, SofaNormalText, SofaImageLoader } from 'sofa-ui-components'

export default defineComponent({
	name: 'ClassCard',
	components: { SofaNormalText, SofaIcon, SofaImageLoader },
	props: {
		classObj: {
			type: Object as () => any,
			required: true,
		},
	},
	setup() {
		return {}
	},
})
</script>
