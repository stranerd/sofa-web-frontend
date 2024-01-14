<template>
	<SofaTopBar
		v-if="!hide.top"
		:subpage-actions="topbarOptions.actions"
		:title="topbarOptions.title"
		:type="topbarOptions.type"
		:custom-class="'hidden mdlg:!flex'" />
	<div
		:class="`h-full w-full overflow-y-auto mx-auto flex-grow relative mdlg:gap-5 flex flex-col items-center lg:text-sm mdlg:text-[12px] text-xs ${width} ${layoutStyle}`"
		:style="bgImage ? `background-image: url(${bgImage})` : ''">
		<slot />
	</div>
	<SofaBottomBar v-if="!hide.bottom" :show-add-item="handleShowAddMaterial" />
</template>

<script lang="ts" setup>
import { PropType, defineProps } from 'vue'
import { handleShowAddMaterial } from '../composables/study'

defineProps({
	topbarOptions: {
		type: Object as () => Partial<{
			type?: string
			title?: string
			actions?: any[]
		}>,
		default: () => {
			return {
				type: 'main',
				title: '',
				actions: [],
			}
		},
	},
	width: {
		type: String,
		default: '',
	},
	layoutStyle: {
		type: String,
		default: '',
	},
	hide: {
		type: Object as PropType<Partial<{ top?: boolean; bottom?: boolean }>>,
		default: () => ({ top: false, bottom: false }),
	},
	bgImage: {
		type: String,
		default: '',
	},
})
</script>
