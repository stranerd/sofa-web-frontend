<template>
	<footer class="w-full bg-[#F9FAFB]">
		<div class="w-[90%] h-[280px] grid grid-cols-4 place-content-center mx-auto">
			<div v-for="footerLink in footerLinks" :key="footerLink.title">
				<p class="text-[16px] pb-2">{{ footerLink.title }}</p>
				<ul class="flex flex-col gap-2">
					<li v-for="link in footerLink.links" :key="link.label">
						<RouterLink :to="link.link" class="text-grayColor">{{ link.label }}</RouterLink>
					</li>
				</ul>
			</div>
		</div>
		<div class="bg-purple h-[90px]">
			<div class="w-[90%] h-full mx-auto flex items-center justify-between">
				<p class="text-white">© {{ new Date().getFullYear() }} Stranerd - All rights reserved</p>
				<div class="flex items-center gap-6">
					<a v-for="social in socials" :key="social.icon" :href="social.link">
						<img :src="social.icon" />
					</a>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
const footerLinks = [
	{
		title: 'About',
		links: [
			{
				label: 'Company',
				link: '#',
			},
			{
				label: 'Blog',
				link: '#',
			},
		],
	},
	{
		title: 'Teach',
		links: [
			{
				label: 'Tutorials',
				link: '#',
			},
			{
				label: 'Tutors',
				link: '#',
			},
		],
	},
	{
		title: 'Learn',
		links: [
			{
				label: 'Exam',
				link: '#',
			},
			{
				label: 'Tutoring',
				link: '#',
			},
		],
	},
	{
		title: 'Support',
		links: [
			{
				label: 'Terms and Conditions',
				link: '#',
			},
			{
				label: 'Privacy Policy',
				link: '#',
			},
			{
				label: 'Honor code',
				link: '#',
			},
			{
				label: 'Contact us',
				link: '#',
			},
		],
	},
]
const socials = [
	{
		link: '#',
		icon: '/images/twitter.png',
	},
	{
		link: '#',
		icon: '/images/instagram.png',
	},
	{
		link: '#',
		icon: '/images/youtube.png',
	},
	{
		link: '#',
		icon: '/images/whatsapp.png',
	},
	{
		link: '#',
		icon: '/images/tiktok.png',
	},
]
</script>
