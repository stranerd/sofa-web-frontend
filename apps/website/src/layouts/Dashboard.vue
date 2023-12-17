<template>
	<SofaTopBar :tabs="tabs" :subpage-actions="topbarOptions.actions" :title="topbarOptions.title"
		:type="topbarOptions.type" :showAddItem="handleShowAddItem"
		:custom-class="`${hide.top ? 'hidden mdlg:!flex' : 'flex'}`" :badges="topbarOptions.badges" />
	<div class="flex-grow overflow-y-auto flex flex-col mdlg:flex-row gap-5 mdlg:gap-0">
		<div v-if="!hide.left" :class="wrap ? 'px-4' : 'hidden p-4 h-full w-full overflow-y-auto'"
			class="w-full mdlg:w-[25%] lg:w-[22%] mdlg:flex mdlg:p-5 flex-col scrollbar-hide gap-5">
			<slot name="left-session" />
		</div>

		<div
			class="flex-1 mdlg:overflow-y-auto mdlg:!py-5 mdlg:px-0 gap-2 flex flex-col lg:text-sm mdlg:text-[12px] text-xs"
			:class="{ [bgColor]: true, 'px-4 w-full mdlg:w-auto': wrap, 'overflow-y-auto': !wrap, 'mdlg:gap-5': !hide.bottom, 'mdlg:gap-0': hide.bottom }">
			<slot name="middle-session" />
		</div>

		<div v-if="!hide.right" :class="wrap ? 'px-4' : 'hidden p-4 h-full w-full overflow-y-auto'"
			class="w-full mdlg:w-[25%] lg:w-[22%] mdlg:flex mdlg:p-5 flex-col scrollbar-hide gap-5">
			<slot name="right-session" />
		</div>
	</div>
	<SofaBottomBar :showAddItem="handleShowAddItem" v-if="!hide.bottom" />
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { SofaBottomBar, SofaTopBar } from 'sofa-ui-components'
import { computed, defineProps } from 'vue'
import { handleShowAddItem } from '../composables'

defineProps({
	topbarOptions: {
		type: Object as () => {
      type: string
      title: string
      actions: any[]
      badges: {
        text: string
        color: string
      }[]
    },
		default: () => {
			return {
				type: 'main',
				title: '',
				actions: [],
				badges: [],
			}
		},
	},
	hide: {
		type: Object as () => Partial<{ top: boolean, bottom: boolean, left: boolean, right: boolean }>,
		default: () => ({ top: false, bottom: false, left: false, right: false }),
	},
	bgColor: {
		type: String,
		default: '',
	},
	wrap: {
		type: Boolean,
		default: false,
	},
})

const { userType } = useAuth()

const tabs = computed(() => [
	{
		name: 'Home',
		path: '/',
		icon: 'home',
		icon_size: 'h-[18px]',
	},
	...(userType.value.isOrg ? [] : [{
		name: 'Chat',
		path: '/chats',
		icon: 'chat',
		icon_size: 'h-[18px]',
	}]),
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
