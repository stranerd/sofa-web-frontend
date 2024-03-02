<template>
	<div class="flex gap-3 mdlg:!hidden items-center py-2 w-full justify-around bg-lightGray">
		<router-link
			v-for="tab in [
				{ path: '/dashboard', icon: 'home' as const },
				...(userType.isOrg ? [] : [{ path: '/chats', icon: 'chat' as const }]),
				{ path: userType.isOrg ? '/organization/classes' : '/classes', icon: 'classes' as const },
				{ path: '/marketplace', icon: 'marketplace' as const },
				{ path: '/library', icon: 'library' as const },
			]"
			:key="tab.path"
			class="flex flex-col items-center justify-center"
			:to="tab.path">
			<SofaIcon
				:name="tab.icon"
				class="fill-deepGray h-[30px] pb-2"
				:class="{ '!fill-primaryPurple': Logic.Common.tabIsActive(tab.path) }" />
			<span v-if="Logic.Common.tabIsActive(tab.path)" class="w-2 h-1 bg-primaryPurple rounded-lg" />
		</router-link>
	</div>
</template>

<script lang="ts" setup>
import SofaIcon from '../SofaIcon/index.vue'
import { useAuth } from '@app/composables/auth/auth'
import { Logic } from 'sofa-logic'

const { userType } = useAuth()
</script>
