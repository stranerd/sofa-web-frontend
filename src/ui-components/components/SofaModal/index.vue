<template>
	<component :is="Teleport" to="body">
		<transition name="fade" appear>
			<div
				class="fixed top-0 w-[100dvw] h-[100dvh] z-[1000] bg-black text-white bg-opacity-40 flex flex-col items-center mdlg:justify-start justify-end">
				<div class="h-full w-full absolute top-0 left-0" @click="close" />
				<div
					class="z-[1] w-full mdlg:w-[50%] max-h-[100%] mdlg:my-[7.5%] mdlg:max-h-[85%] overflow-y-auto bg-white text-bodyBlack rounded-t-2xl mdlg:rounded-b-2xl"
					:class="maxWidth">
					<slot />
				</div>
			</div>
		</transition>
	</component>
</template>

<script lang="ts" setup>
import { Teleport } from 'vue'

withDefaults(
	defineProps<{
		close?: () => void
		maxWidth?: string
	}>(),
	{
		close: () => {},
		maxWidth: 'mdlg:max-w-[800px]',
	},
)
</script>
