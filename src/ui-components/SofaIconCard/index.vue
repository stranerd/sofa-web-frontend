<template>
	<div
		class="w-full cursor-pointer mdlg:p-4 p-3 flex justify-between items-center mdlg:bg-lightGray bg-white shadow-custom mdlg:shadow-none gap-3 rounded-custom">
		<div :class="`flex items-center gap-3 grow ${data.isDone ? 'opacity-50' : ''}`">
			<SofaIcon :class="data.iconSize" :name="data.icon" />
			<div class="flex-1 flex flex-col">
				<div class="flex items-center gap-2">
					<SofaHeading :content="data.title" />
					<SofaIcon v-if="showArrow" class="h-[12px] fill-black" name="arrow-right" />
				</div>
				<SofaText clamp>{{ data.subTitle }}</SofaText>
			</div>
		</div>

		<SofaIcon v-if="data.isDone" class="h-[22px]" name="selected" />
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
