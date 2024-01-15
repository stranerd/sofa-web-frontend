<template>
	<div
		:class="`w-[280px] mdlg:!w-full ${customClass} cursor-pointer  mdlg:!px-4 mdlg:!py-4 px-3 py-3 flex flex-row justify-between items-center mdlg:!bg-lightGray bg-white shadow-custom mdlg:!shadow-none gap-3 rounded-custom`">
		<div :class="`flex flex-row items-center gap-3 flex-grow  ${data.isDone ? 'opacity-50' : ''}`">
			<div>
				<SofaIcon :customClass="data.iconSize" :name="data.icon" />
			</div>
			<div class="w-full flex flex-col">
				<div class="flex flex-row items-center gap-2">
					<slot name="title" />
					<SofaIcon v-if="showArrow" customClass="h-[12px]" name="right-arrow" />
				</div>
				<SofaNormalText customClass="text-left w-full !line-clamp-1">
					{{ data.subTitle }}
				</SofaNormalText>
			</div>
		</div>

		<div class="w-[45px] text-right">
			<SofaIcon v-if="data.isDone" customClass="h-[22px] inline-block" name="selected" />
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SofaIcon from '../SofaIcon'
import { SofaNormalText } from '../SofaTypography'

export default defineComponent({
	name: 'SofaIconCard',
	components: {
		SofaIcon,
		SofaNormalText,
	},
	props: {
		customClass: {
			type: String,
			default: ' ',
		},
		data: {
			type: Object as () => {
				title: string
				subTitle: string
				icon: string
				iconSize: string
				isDone?: any
			},
			required: true,
		},
		showArrow: {
			type: Boolean,
			default: true,
		},
	},
})
</script>
