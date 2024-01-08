<template>
	<router-link
		:to="chat.route"
		:class="`w-full flex items-center justify-between relative gap-3 p-3 rounded-custom hover:bg-lightBlue ${customClass}`"
		exact-active-class="bg-lightBlue">
		<div class="flex gap-2 w-full">
			<sofa-avatar :photo-url="chat.photoUrl" size="40" />
			<div class="flex flex-col">
				<sofa-normal-text :custom-class="'!font-semibold text-left !line-clamp-1'">
					{{ chat.title }}
				</sofa-normal-text>
				<sofa-normal-text :custom-class="'text-left !line-clamp-1'" :color="'text-grayColor'">
					{{ chat.lastMessage }}
				</sofa-normal-text>
			</div>
		</div>

		<div class="flex flex-col justify-between items-end">
			<sofa-normal-text :custom-class="'text-right !text-[11px] whitespace-nowrap'" :color="'text-grayColor'">
				{{ chat.lastMessageTime }}
			</sofa-normal-text>
		</div>
	</router-link>
</template>

<script lang="ts">
import { SofaAvatar, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'

export default defineComponent({
	components: {
		SofaNormalText,
		SofaAvatar,
	},
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
