<template>
	<SofaTopBar
		:subpageActions="topbarOptions.actions"
		:title="topbarOptions.title"
		:type="topbarOptions.type"
		:customClass="hide.top ? 'hidden mdlg:!flex' : 'flex'"
		:badges="topbarOptions.badges" />
	<div class="flex-grow overflow-y-auto flex flex-col mdlg:flex-row gap-5 mdlg:gap-0">
		<div
			v-if="!hide.left"
			:class="wrap ? 'px-4' : 'hidden p-4 h-full w-full overflow-y-auto'"
			class="w-full mdlg:w-[25%] lg:w-[22%] mdlg:flex mdlg:p-5 flex-col scrollbar-hide gap-5">
			<slot name="left-session" />
		</div>

		<div
			class="flex-1 mdlg:overflow-y-auto mdlg:py-5 mdlg:px-0 gap-2 flex flex-col lg:text-sm mdlg:text-[12px] text-xs"
			:class="{
				[bgColor]: true,
				'px-4 w-full mdlg:w-auto': wrap,
				'overflow-y-auto': !wrap,
				'mdlg:gap-5': !hide.bottom,
				'mdlg:gap-0': hide.bottom,
				'!pb-0': noBottomPadding,
			}">
			<slot name="middle-session" />
		</div>

		<div
			v-if="!hide.right"
			:class="wrap ? 'px-4' : 'hidden p-4 h-full w-full overflow-y-auto'"
			class="w-full mdlg:w-[25%] lg:w-[22%] mdlg:flex mdlg:p-5 flex-col scrollbar-hide gap-5">
			<slot name="right-session" />
		</div>
	</div>
	<SofaBottomBar v-if="!hide.bottom" />
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		topbarOptions?: Partial<{
			type: string
			title: string
			actions: any[]
			badges: {
				text: string
				color: string
			}[]
		}>
		hide?: Partial<{ top?: boolean; bottom?: boolean; left?: boolean; right?: boolean }>
		bgColor?: string
		wrap?: boolean
		noBottomPadding?: boolean
	}>(),
	{
		topbarOptions: () => ({
			type: 'main',
			title: '',
			actions: [],
			badges: [],
		}),
		hide: () => ({ top: false, bottom: false, left: false, right: false }),
		bgColor: '',
		wrap: false,
		noBottomPadding: false,
	},
)
</script>
