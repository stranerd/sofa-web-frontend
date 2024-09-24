<template>
	<div class="w-full flex flex-col gap-3 justify-center items-center py-9 px-6 rounded-custom bg-primaryPurple text-white">
		<SofaIcon v-if="icon" :class="icon.size" :name="icon.name" />
		<svg v-else width="30" height="30" viewBox="0 0 30 30" class="h-[28px]" fill="current">
			<path
				d="M15 22.666C15.5522 22.666 16 22.2183 16 21.666V13.666C16 13.1137 15.5522 12.666 15 12.666C14.4477 12.666 14 13.1137 14 13.666V21.666C14 22.2183 14.4477 22.666 15 22.666Z" />
			<path
				d="M15 8.33268C15.7363 8.33268 16.3333 8.92964 16.3333 9.66601C16.3333 10.4024 15.7363 10.9993 15 10.9993C14.2636 10.9993 13.6666 10.4024 13.6666 9.66601C13.6666 8.92964 14.2636 8.33268 15 8.33268Z" />
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M0.666626 14.9993C0.666626 7.08327 7.08388 0.666016 15 0.666016C22.916 0.666016 29.3333 7.08327 29.3333 14.9993C29.3333 22.9154 22.916 29.3327 15 29.3327C7.08388 29.3327 0.666626 22.9154 0.666626 14.9993ZM15 2.66602C8.18845 2.66602 2.66663 8.18784 2.66663 14.9993C2.66663 21.8109 8.18845 27.3327 15 27.3327C21.8115 27.3327 27.3333 21.8109 27.3333 14.9993C27.3333 8.18784 21.8115 2.66602 15 2.66602Z" />
		</svg>
		<div class="w-full flex flex-col gap-2 justify-center items-center py-2">
			<SofaHeading size="title" :content="title" :class="titleStyle" />
			<SofaText :content="subTitle" class="w-full font-lighter text-center" />
		</div>
		<SofaButton v-if="action" class="!whitespace-nowrap" color="white" padding="py-1 px-4" @click="action?.()">
			{{ actionLabel }}
		</SofaButton>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SofaEmptyState',
	props: {
		title: {
			type: String,
			default: '',
		},
		titleStyle: {
			type: String,
			default: '',
		},
		subTitle: {
			type: String,
			default: '',
		},
		action: {
			type: Function,
			default: null,
		},
		actionLabel: {
			type: String,
			default: '',
		},
		icon: {
			type: Object as () => {
				name: IconName
				size: string
			},
			default: null,
		},
	},
})
</script>
