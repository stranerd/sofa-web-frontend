<template>
	<component
		:is="userId ? 'router-link' : as"
		:to="`/profile/${userId}`"
		class="shrink-0 rounded-full flex font-semibold bg-opacity-75 cursor-pointer items-center justify-center relative"
		:class="bgColor"
		:style="`width: ${size}px; height: ${size}px;`">
		<SofaImageLoader v-if="photoUrl" :photoUrl="photoUrl" class="w-full h-full rounded-full" />
		<slot v-else>
			<SofaIcon class="w-1/2 h-1/2" name="user" />
		</slot>
		<span
			v-if="online !== undefined"
			class="size-[5px] absolute bottom-0 right-0 rounded-full"
			:class="online ? 'bg-primaryGreen' : 'bg-grayColor'" />
	</component>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		as?: string
		size?: number
		photoUrl?: string | null
		bgColor?: string
		userId?: string
		online?: boolean
	}>(),
	{
		as: 'span',
		size: 50,
		photoUrl: null,
		bgColor: 'bg-grayColor',
		userId: undefined,
		online: undefined,
	},
)
</script>
