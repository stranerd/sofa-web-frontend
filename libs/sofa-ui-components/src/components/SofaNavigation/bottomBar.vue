<template>
	<div class="grid grid-cols-5 gap-3 mdlg:!hidden items-center py-2 w-full justify-center bg-lightGray">
		<a v-for="tab in [
				{ path: '/', icon: 'home' },
				{ path: '/chats', icon: 'chat' },
				{ name: 'showAddItem', icon: 'plus-white', onClick: showAddItem },
				{ path: '/marketplace', icon: 'marketplace' },
				{ path: '/library', icon: 'library' },
			]" :key="tab.path ?? tab.name" class="col-span-1 flex flex-col items-center justify-center"
			@click="() => tab.onClick?.() ?? Logic.Common.GoToRoute(tab.path)">
			<div v-if="tab.onClick" class="h-[52px] w-[52px] rounded-full flex justify-center items-center bg-primaryPurple">
				<SofaIcon :name="tab.icon" class="h-[17px]" />
			</div>
			<template v-else>
				<SofaIcon :name="tab.icon"
					:class="{ '!fill-primaryPurple': Logic.Common.tabIsActive(tab.path), 'fill-deepGray h-[30px] pb-2': true }" />
				<span v-if="Logic.Common.tabIsActive(tab.path)" class="w-[8px] h-[4px] bg-primaryPurple rounded-lg" />
			</template>
		</a>
	</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { Logic } from 'sofa-logic'
import SofaIcon from '../SofaIcon/index.vue'

defineProps({
	showAddItem: {
		type: Function,
		required: true,
	},
})
</script>
