<template>
	<div class="w-full py-10 flex flex-col items-center bg-white min-h-screen">
		<img src="/images/stranerd_logo.png" />
		<ul class="flex flex-col items-center gap-6 pt-20">
			<li v-for="link in links" :key="link.label">
				<RouterLink
					:to="link.link"
					class="hover:text-purple hover:border-b-2 border-purple"
					:class="route.path === link.link ? 'border-b-2 border-purple text-purple' : ''"
					@click.stop="closeMobileMenu">
					{{ link.label }}
				</RouterLink>
			</li>
		</ul>
		<ul class="flex flex-col items-center gap-6 pt-20">
			<li>
				<RouterLink to="/auth/signup" class="bg-purple text-white py-[10px] px-[19px] rounded-lg" @click.stop="closeMobileMenu">
					Sign up
				</RouterLink>
			</li>
			<li><RouterLink to="/auth/signin" @click.stop="closeMobileMenu">Log in</RouterLink></li>
		</ul>
	</div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useModals } from '@app/composables/core/modals'
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
const closeMobileMenu = () => {
	useModals().users.mobileMenu.close()
}
</script>
