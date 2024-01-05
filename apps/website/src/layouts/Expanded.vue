<template>
	<SofaTopBar
		:tabs="tabs"
		:subpage-actions="topbarOptions.actions"
		:title="topbarOptions.title"
		:user="user"
		:type="topbarOptions.type"
		:showAddItem="handleShowAddItem"
		v-if="!hide.top"
		:custom-class="'hidden mdlg:!flex'" />
	<div
		:class="`h-full w-full overflow-y-auto mx-auto flex-grow pb-5 relative mdlg:gap-5 flex flex-col items-center lg:text-sm mdlg:text-[12px] text-xs ${width} ${layoutStyle}`"
		:style="bgImage ? `background-image: url(${bgImage})` : ''">
		<slot />
	</div>
	<SofaBottomBar v-if="!hide.bottom" :showAddItem="handleShowAddItem" />
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { SofaBottomBar, SofaTopBar } from 'sofa-ui-components'
import { PropType, computed, defineProps } from 'vue'
import { handleShowAddItem } from '../composables'

defineProps({
	topbarOptions: {
		type: Object as () => {
			type: string
			title: string
			actions: any[]
		},
		default: () => {
			return {
				type: 'main',
				title: '',
				actions: [],
			}
		},
	},
	width: {
		type: String,
		default: '',
	},
	layoutStyle: {
		type: String,
		default: '',
	},
	hide: {
		type: Object as PropType<{ top: boolean; bottom: boolean }>,
		default: () => ({ top: false, bottom: false }),
	},
	bgImage: {
		type: String,
		default: '',
	},
})

const { user, userType } = useAuth()

const tabs = computed(() => [
	{
		name: 'Home',
		path: '/',
		icon: 'home',
		icon_size: 'h-[18px]',
	},
	...(userType.value.isOrg
		? []
		: [
				{
					name: 'Chat',
					path: '/chats',
					icon: 'chat',
					icon_size: 'h-[18px]',
				},
			]),
	{
		name: 'Library',
		path: '/library',
		icon: 'library',
		icon_size: 'h-[18px]',
	},
	// {
	//   name: "Analytics",
	//   path: "/analytics",
	//   icon: "analytics",
	//   icon_size: "h-[18px]",
	// },
	{
		name: 'Marketplace',
		path: '/marketplace',
		icon: 'marketplace',
		icon_size: 'h-[18px]',
	},
])
</script>
