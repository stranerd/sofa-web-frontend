<template>
	<div class="flex gap-3 mdlg:hidden items-center pt-2.5 pb-1 w-full justify-around bg-lightGray">
		<router-link
			v-for="tab in [
				{ path: '/dashboard', icon: 'home' as const },
				...(userType.isOrg ? [] : [{ path: '/chats', icon: 'chat' as const }]),
				{ path: userType.isOrg ? '/dashboard/classes' : '/classes', icon: 'classes' as const },
				{ path: '/marketplace', icon: 'marketplace' as const },
				{ path: '/library', icon: 'library' as const },
			]"
			:key="tab.path"
			class="flex flex-col items-center justify-start"
			:to="tab.path">
			<SofaIcon
				:name="tab.icon"
				class="fill-deepGray h-[30px] pb-1.5"
				:class="{ '!fill-primaryPurple': $utils.tabIsActive(tab.path) }" />
			<span v-if="$utils.tabIsActive(tab.path)" class="w-2 h-1 bg-primaryPurple rounded-lg" />
		</router-link>
	</div>
</template>

<script lang="ts" setup>
import SofaIcon from '../SofaIcon/index.vue'
import { useAuth } from '@app/composables/auth/auth'

const { userType } = useAuth()
</script>
