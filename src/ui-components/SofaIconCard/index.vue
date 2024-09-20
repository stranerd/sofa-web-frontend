<template>
	<div
		class="w-[280px] mdlg:!w-full cursor-pointer mdlg:!px-4 mdlg:!py-4 px-3 py-3 flex flex-row justify-between items-center mdlg:!bg-lightGray bg-white shadow-custom mdlg:!shadow-none gap-3 rounded-custom">
		<div :class="`flex flex-row items-center gap-3 grow  ${data.isDone ? 'opacity-50' : ''}`">
			<div>
				<SofaIcon :class="data.iconSize" :name="data.icon" />
			</div>
			<div class="w-full flex flex-col">
				<div class="flex items-center gap-2">
					<slot name="title" />
					<SofaIcon v-if="showArrow" class="h-[12px] fill-black" name="arrow-right" />
				</div>
				<SofaText clamp>{{ data.subTitle }}</SofaText>
			</div>
		</div>

		<div class="w-[45px] text-right">
			<SofaIcon v-if="data.isDone" class="h-[22px] inline-block" name="selected" />
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SofaIconCard',
	props: {
		data: {
			type: Object as () => {
				title: string
				subTitle: string
				icon: IconName
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
