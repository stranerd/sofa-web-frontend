<template>
	<component
		:is="as"
		class="bg-white flex gap-2 p-3 mdlg:p-4 rounded-custom items-start"
		:class="wrapped ? 'flex-col w-[180px]' : 'flex-row w-full'">
		<SofaImageLoader class="aspect-video rounded-custom" :class="wrapped ? 'w-full' : 'w-[150px] mdlg:w-[168px]'" :photoUrl="image" />
		<div class="flex flex-col gap-1 w-full">
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
