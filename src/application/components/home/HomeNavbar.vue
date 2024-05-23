<template>
	<nav class="w-full h-[65px] bg-white flex items-center justify-center sticky top-0 left-0 z-[1000]">
		<div class="w-[90%] mx-auto flex items-center justify-between max-w-[1800px]">
			<button class="block mdlg:hidden">
				<SofaIcon name="menu" class="h-[24px]" @click="openMobileMenu" />
			</button>
			<Logo class="h-[30px]" />
			<ul class="hidden mdlg:flex items-center gap-6">
				<li v-for="link in links" :key="link.label">
					<RouterLink
						:to="link.link"
						class="hover:text-purple hover:border-b-2 border-purple"
						:class="$route.path === link.link ? 'border-b-2 border-purple text-purple' : ''">
						{{ link.label }}
					</RouterLink>
				</li>
			</ul>
			<ul class="hidden mdlg:flex items-center gap-6">
				<li>
					<RouterLink to="/auth/signup" class="bg-purple text-white py-[10px] px-[19px] rounded-lg">Sign up</RouterLink>
				</li>
				<li><RouterLink to="/auth/signin">Log in</RouterLink></li>
			</ul>
			<RouterLink
				to="/auth/signup"
				class="block md:hidden bg-purple text-white py-[10px] px-[19px] rounded-lg text-[14px] md:text-[16px]">
				Get Started
			</RouterLink>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { useModals } from '@app/composables/core/modals'
const links = [
	{
		label: 'Home',
		link: '/',
	},
	{
		label: 'Features',
		link: '/home/features',
	},
	{
		label: 'Pricing',
		link: '/home/pricing',
	},
	{
		label: 'About us',
		link: '/home/about',
	},
	{
		label: 'Contact',
		link: '/home/contact',
	},
]
const openMobileMenu = () => {
	useModals().users.mobileMenu.open({})
}
</script>

<style scoped>
nav {
	box-shadow: 0 4px 24px 0 #00000080;
}
</style>
