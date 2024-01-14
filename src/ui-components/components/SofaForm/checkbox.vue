<template>
	<div class="flex w-full flex-col gap-2">
		<a class="flex w-full gap-2 items-center" @click="selected = !selected">
			<span class="w-[25px]">
				<sofa-icon :name="`${selected ? 'checkbox-active' : 'checkbox'}`" :custom-class="`md:!h-[18px] h-[20px]`" />
			</span>
			<span class="flex gap-2 items-center lg:text-sm mdlg:text-[12px] text-xs">
				<slot />
			</span>
		</a>
	</div>
</template>
<script lang="ts" setup>
import SofaIcon from '../SofaIcon/index.vue'

const selected = defineModel<boolean>({ default: false })
</script>
