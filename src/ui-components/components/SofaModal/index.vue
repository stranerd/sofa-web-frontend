<template>
	<component :is="Teleport" to="body">
		<transition name="fade" appear>
			<div
				class="fixed top-0 w-[100dvw] h-[100dvh] z-[1000] bg-black text-white bg-opacity-40 flex flex-col items-center mdlg:justify-start justify-end">
				<div class="h-full w-full absolute top-0 left-0" @click="close" />
				<div
					ref="modal"
					class="z-[1] w-full mdlg:w-[50%] max-h-[100dvh] mdlg:max-h-[90dvh] overflow-y-auto bg-white text-bodyBlack rounded-t-2xl mdlg:rounded-b-2xl"
					:class="{ [maxWidth]: true, [containerClass]: true, 'mdlg:my-[5dvh]': !popover }"
					:style="calculatePosition()">
					<slot />
				</div>
			</div>
		</transition>
	</component>
</template>

<script lang="ts" setup>
import { Teleport, ref } from 'vue'
import { Logic } from 'sofa-logic'

const props = withDefaults(
	defineProps<{
		close?: () => void
		popover?: boolean
		event?: PointerEvent
		maxWidth?: string
		containerClass?: string
	}>(),
	{
		close: () => {},
		popover: false,
		event: undefined,
		maxWidth: 'mdlg:max-w-[800px]',
		containerClass: '',
	},
)

const modal = ref<HTMLDivElement>()

const calculatePosition = () => {
	if (!props.event || !modal.value || !props.popover || !Logic.Common.isLarge) return ''
	const bounds = modal.value.getBoundingClientRect()
	let top = props.event.y
	const bottomDiff = top + bounds.height - window.innerHeight
	if (bottomDiff > 0) top -= bottomDiff + 30
	let left = props.event.x
	const rightDiff = left + bounds.width - window.innerWidth
	if (rightDiff > 0) left -= rightDiff + 30
	return `position: fixed; top: ${top}px; left: ${left}px;`
}
</script>
