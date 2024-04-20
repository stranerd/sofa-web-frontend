<template>
	<SofaTopBar v-if="!hide.top" v-bind="topbarOptions" class="hidden mdlg:flex" />
	<div
		class="h-full w-full overflow-y-auto mx-auto grow relative mdlg:gap-5 flex flex-col items-center lg:text-sm mdlg:text-[12px] text-xs"
		:class="[width, layoutStyle]"
		:style="bgImage ? `background-image: url(${bgImage})` : ''">
		<slot />
	</div>
	<SofaBottomBar v-if="!hide.bottom" />
</template>

<script lang="ts" setup>
import { SofaTopBar } from 'sofa-ui-components'

withDefaults(
	defineProps<{
		topbarOptions?: InstanceType<typeof SofaTopBar>['$props']
		width?: string
		layoutStyle?: string
		hide?: Partial<{ top?: boolean; bottom?: boolean }>
		bgImage?: string
	}>(),
	{
		topbarOptions: undefined,
		width: '',
		layoutStyle: '',
		hide: () => ({ top: false, bottom: false }),
		bgImage: undefined,
	},
)
</script>
