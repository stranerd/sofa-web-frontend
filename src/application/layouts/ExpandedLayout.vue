<template>
	<SofaTopBar
		v-if="!hide.top"
		:subpageActions="topbarOptions.actions"
		:title="topbarOptions.title"
		:type="topbarOptions.type"
		customClass="hidden mdlg:!flex" />
	<div
		:class="`h-full w-full overflow-y-auto mx-auto flex-grow relative mdlg:gap-5 flex flex-col items-center lg:text-sm mdlg:text-[12px] text-xs ${width} ${layoutStyle}`"
		:style="bgImage ? `background-image: url(${bgImage})` : ''">
		<slot />
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
		}>
		width?: string
		layoutStyle?: string
		hide?: Partial<{ top?: boolean; bottom?: boolean }>
		bgImage?: string
	}>(),
	{
		topbarOptions: () => ({
			type: 'main',
			title: '',
			actions: [],
		}),
		width: '',
		layoutStyle: '',
		hide: () => ({ top: false, bottom: false }),
		bgImage: '',
	},
)
</script>
