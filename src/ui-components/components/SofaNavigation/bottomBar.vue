<template>
	<div class="grid grid-cols-5 gap-3 mdlg:!hidden items-center py-2 w-full justify-center bg-lightGray">
		<a
			v-for="tab in [
				{ path: '/', icon: 'home' as const },
				{ path: '/chats', icon: 'chat' as const },
				{ name: 'showAddItem', icon: 'plus-white' as const, onClick: handleShowAddMaterial },
				{ path: '/marketplace', icon: 'marketplace' as const },
				{ path: '/library', icon: 'library' as const },
			]"
			:key="tab.path ?? tab.name"
			class="col-span-1 flex flex-col items-center justify-center"
			@click="() => tab.onClick?.() ?? (tab.path && Logic.Common.GoToRoute(tab.path))">
			<div v-if="tab.onClick" class="h-[52px] w-[52px] rounded-full flex justify-center items-center bg-primaryPurple">
				<SofaIcon :name="tab.icon" class="h-[17px]" />
			</div>
			<template v-else>
				<SofaIcon
					:name="tab.icon"
					:class="{
						'!fill-primaryPurple': Logic.Common.tabIsActive(tab.path),
						'fill-deepGray h-[30px] pb-2': true,
					}" />
				<span v-if="Logic.Common.tabIsActive(tab.path)" class="w-[8px] h-[4px] bg-primaryPurple rounded-lg" />
			</template>
		</a>
	</div>
</template>

<script lang="ts" setup>
import SofaIcon from '../SofaIcon/index.vue'
import { Logic } from 'sofa-logic'
import { handleShowAddMaterial } from '@app/composables/study'
</script>
