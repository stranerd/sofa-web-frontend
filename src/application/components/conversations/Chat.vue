<template>
	<router-link
		:to="chat.route"
		class="w-full flex items-center justify-between relative gap-3 p-3 mdlg:px-0 rounded-custom hover:bg-lightBlue"
		:class="customClass"
		exactActiveClass="bg-lightBlue">
		<div class="flex gap-2 w-full">
			<SofaAvatar :photoUrl="chat.photoUrl" :size="40" />
			<div class="flex flex-col">
				<SofaNormalText customClass="!font-semibold text-left !line-clamp-1">
					{{ chat.title }}
				</SofaNormalText>
				<SofaNormalText customClass="text-left !line-clamp-1" color="text-grayColor">
					{{ chat.lastMessage }}
				</SofaNormalText>
			</div>
		</div>

		<div class="flex flex-col justify-between items-end">
			<SofaNormalText customClass="text-right !text-[11px] whitespace-nowrap" color="text-grayColor">
				{{ chat.lastMessageTime }}
			</SofaNormalText>
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
