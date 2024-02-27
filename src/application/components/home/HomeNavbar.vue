<template>
	<nav class="w-full h-[65px] bg-white flex items-center justify-center">
		<div class="w-[90%] mx-auto flex items-center justify-between">
			<img src="/images/stranerd_logo.png" />
			<ul class="hidden mdlg:flex items-center gap-6">
				<li v-for="link in links" :key="link.label">
					<RouterLink
						:to="link.link"
						class="hover:text-purple hover:border-b-2 border-purple"
						:class="route.path === link.link ? 'border-b-2 border-purple text-purple' : ''">
						{{ link.label }}
					</RouterLink>
				</li>
			</ul>
			<ul class="hidden mdlg:flex items-center gap-6">
				<li>
					<RouterLink to="/register" class="bg-purple text-white py-[10px] px-[19px] rounded-lg">Sign up</RouterLink>
				</li>
				<li><RouterLink to="/register">Log in</RouterLink></li>
			</ul>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const links = [
	{
		label: 'Home',
		link: '/home/students',
	},
	{
		label: 'Features',
		link: '/home/features',
	},
	{
		label: 'Pricing',
		link: '/',
	},
	{
		label: 'About us',
		link: '/home/about',
	},
	{
		label: 'Contact',
		link: '/',
	},
]
const route = useRoute()
</script>

<style scoped>
nav {
	box-shadow: 0px 4px 24px 0px #00000080;
}
</style>
