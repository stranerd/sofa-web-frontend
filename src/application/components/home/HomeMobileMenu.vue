<template>
	<div
		class="fixed left-0 right-0 top-0 w-full py-10 flex flex-col items-center bg-white min-h-screen"
		style="z-index: 9999999999999999999999999999999 !important">
		<img src="/images/stranerd_logo.png" />
		<ul class="flex flex-col items-center gap-6 pt-20">
			<li v-for="link in links" :key="link.label">
				<RouterLink
					:to="link.link"
					class="hover:text-purple hover:border-b-2 border-purple"
					:class="route.path === link.link ? 'border-b-2 border-purple text-purple' : ''"
					@click.stop="showMenu = false">
					{{ link.label }}
				</RouterLink>
			</li>
		</ul>
		<ul class="flex flex-col items-center gap-6 pt-20">
			<li>
				<RouterLink to="/auth/signup" class="bg-purple text-white py-[10px] px-[19px] rounded-lg" @click.stop="showMenu = false">
					Sign up
				</RouterLink>
			</li>
			<li><RouterLink to="/auth/signin" @click.stop="showMenu = false">Log in</RouterLink></li>
		</ul>
	</div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useMenu } from '@app/composables/core/menu'
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
const route = useRoute()
const { showMenu } = useMenu()
</script>
