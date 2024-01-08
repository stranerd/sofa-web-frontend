<template>
	<component :is="Teleport" to="body">
		<transition name="fade" appear>
			<div
				class="fixed top-0 w-[100dvw] h-[100dvh] z-[1000] bg-black text-white bg-opacity-40 flex flex-col items-center mdlg:justify-start justify-end">
				<div class="h-full w-full absolute top-0 left-0" @click="closeModal" />
				<div
					class="z-[1] w-full mdlg:w-[50%] max-h-[100%] mdlg:mt-[10%] mdlg:max-h-[80%] overflow-y-auto bg-white text-bodyBlack rounded-t-2xl mdlg:rounded-b-2xl"
					:class="maxWidth">
					<slot />
				</div>
			</div>
		</transition>
	</component>
</template>

<script lang="ts" setup>
import { Teleport, defineProps } from 'vue'

const props = defineProps({
	close: {
		type: Function,
		required: false,
		default: null,
	},
	maxWidth: {
		type: String,
		required: false,
		default: 'mdlg:max-w-[800px]',
	},
})

const closeModal = () => {
	props.close?.()
}
</script>
