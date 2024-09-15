<template>
	<router-link
		:to="chat.route"
		class="w-full flex items-center justify-between relative gap-3 p-3 mdlg:px-0 rounded-custom hover:bg-lightBlue"
		:class="customClass"
		exactActiveClass="bg-lightBlue">
		<div class="flex gap-2 w-full">
			<SofaAvatar :photoUrl="chat.photoUrl" :size="40" />
			<div class="flex flex-col">
				<SofaHeading>{{ chat.title }}</SofaHeading>
				<SofaText clamp>{{ chat.lastMessage }}</SofaText>
			</div>
		</div>

		<div class="flex flex-col justify-between items-end">
			<SofaText size="sub" class="text-right whitespace-nowrap">{{ chat.lastMessageTime }}</SofaText>
		</div>
	</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		chat: {
			type: Object as () => {
				route: string
				title: string
				lastMessage: string
				lastMessageTime: string
				photoUrl: string | null
			},
			required: true,
		},
		customClass: {
			type: String,
			default: '',
		},
	},
	setup() {
		return {}
	},
})
</script>
