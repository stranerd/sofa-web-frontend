<template>
	<button
		:disabled="loading || disabled"
		class="focus:outline-none disabled:opacity-75 rounded-lg flex gap-2 font-bold items-center font-size-sub justify-center whitespace-nowrap"
		:class="{
			'shadow-button': shadow,
			[padding]: true,
			'bg-primaryBlue text-white': color === 'blue' && !inverted,
			'bg-primaryPurple text-white': color === 'purple' && !inverted,
			'bg-primaryRed text-white': color === 'red' && !inverted,
			'bg-primaryGreen text-white': color === 'green' && !inverted,
			'bg-[#FBFBFB] text-bodyBlack': color === 'white' && !inverted,
			'bg-grayColor text-white': color === 'gray' && !inverted,
			'bg-deepGray text-white': color === 'deepGray' && !inverted,
			'bg-transparent': color === 'transparent',
		}">
		<slot />
	</button>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		color?: 'blue' | 'purple' | 'red' | 'green' | 'white' | 'gray' | 'deepGray' | 'transparent'
		inverted?: boolean
		padding?: string
		loading?: boolean
		shadow?: boolean
		disabled?: boolean
	}>(),
	{
		color: 'blue',
		inverted: false,
		padding: 'py-1 px-3',
		loading: false,
		shadow: false,
		disabled: false,
	},
)
</script>

<style scoped>
.shadow-button {
	box-shadow: 0 1px #999;
}

.shadow-button:active {
	transform: translateY(1px);
	box-shadow: none;
}
</style>
