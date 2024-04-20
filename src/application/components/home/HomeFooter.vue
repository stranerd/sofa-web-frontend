<template>
	<footer class="w-full bg-[#F9FAFB]">
		<div class="w-[90%] min-h-[280px] py-6 grid grid-cols-3 gap-8 md:gap-0 md:grid-cols-4 place-content-center mx-auto max-w-[1800px]">
			<div v-for="footerLink in footerLinks" :key="footerLink.title">
				<p class="text-[16px] md:text-[18px] pb-2">{{ footerLink.title }}</p>
				<ul class="flex flex-col gap-2">
					<li v-for="link in footerLink.links" :key="link.label">
						<RouterLink :to="link.link" class="text-grayColor text-[14px] md:text-[16px]">{{ link.label }}</RouterLink>
					</li>
				</ul>
			</div>
		</div>
		<div class="bg-purple min-h-[90px] flex items-center justify-center]">
			<div
				class="w-[90%] mx-auto flex flex-col md:flex-row items-center py-10 md:py-0 justify-center gap-8 md:justify-between max-w-[1800px]">
				<p class="text-white">© {{ new Date().getFullYear() }} Stranerd - All rights reserved</p>
				<div class="flex items-center gap-6">
					<a v-for="social in socials" :key="social.icon" :href="social.link" target="_blank">
						<SofaIcon :name="social.icon" class="h-6 fill-white" />
					</a>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
const { INSTAGRAM_LINK, TIKTOK_LINK, TWITTER_LINK, YOUTUBE_LINK, WHATSAPP_LINK } = $utils.constants
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
		link: TWITTER_LINK,
		icon: 'socials-twitter',
	},
	{
		link: INSTAGRAM_LINK,
		icon: 'socials-instagram',
	},
	{
		link: YOUTUBE_LINK,
		icon: 'socials-youtube',
	},
	{
		link: WHATSAPP_LINK,
		icon: 'socials-whatsapp',
	},
	{
		link: TIKTOK_LINK,
		icon: 'socials-tiktok',
	},
] as const
</script>
