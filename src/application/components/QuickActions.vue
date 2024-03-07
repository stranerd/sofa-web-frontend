<template>
	<div class="relative">
		<button class="bg-lightGray p-2 flex items-center justify-center gap-2 min-w-[210px]" @click="showPopOver = !showPopOver">
			<div class="bg-[#FF8800] w-[32px] h-[32px] rounded-lg flex items-center justify-center">
				<SofaIcon name="light-bulb" />
			</div>
			<SofaNormalText>Quick Actions</SofaNormalText>
			<SofaIcon name="angle-small-down" :class="{ 'rotate-180 transition duration-100': showPopOver }" />
		</button>
		<div
			v-if="showPopOver"
			class="absolute top-[60px] left-0 right-0 bg-white rounded-custom flex flex-col gap-2 p-4"
			style="box-shadow: 0px 16px 32px 0px #78828c26">
			<button v-for="(button, index) in buttons" :key="index" class="bg-lightGray p-3 w-full rounded-lg flex items-center gap-2">
				<SofaIcon name="add-gray" class="!fill-deepGray h-[16px]" />
				<p>{{ button.label }}</p>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
	name: 'SofaQuickActions',
	props: {
		buttons: {
			type: Array as () => Array<{
				label: string
				action: () => void
			}>,
			default: () => [],
			required: true,
		},
	},
	setup() {
		const showPopOver = ref(false)
		return {
			showPopOver,
		}
	},
})
</script>
