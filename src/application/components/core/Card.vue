<template>
	<component
		:is="as"
		class="bg-white text-deepGray flex gap-2 p-3 mdlg:p-4 rounded-custom items-start shrink-0 shadow-itemBox mdlg:shadow-none cursor-pointer"
		:class="wrapped ? 'flex-col w-[210px]' : 'flex-row w-full'">
		<SofaImageLoader class="rounded-custom" :class="wrapped ? 'w-full' : 'w-[144px] mdlg:w-[168px]'" aspect="3/2" :photoUrl="image">
			<slot name="image-content" />
		</SofaImageLoader>
		<div class="flex flex-col w-full" :class="wrapped ? 'gap-2' : 'gap-1'">
			<slot />
		</div>
	</component>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		as?: string
		wrapped?: boolean
		image: string
	}>(),
	{
		as: 'div',
		wrapped: false,
	},
)
</script>
