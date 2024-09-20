<template>
	<SettingsLayout title="Contact Us">
		<div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
			<div class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom">
				<SofaHeading size="title" content="Contact details" />

				<div class="w-full flex flex-row items-center gap-5 flex-wrap">
					<a v-for="social in socials" :key="social.link" :href="social.link" target="_blank">
						<SofaIcon class="h-5 fill-deepGray" :name="social.icon" />
					</a>
				</div>
			</div>

			<form class="w-full flex flex-col gap-4 bg-white rounded-2xl mdlg:p-5 p-4 shadow-custom" @submit.prevent="sendMessage">
				<SofaHeading size="title" content="Give feedback" />

				<SofaTextarea v-model="factory.message" placeholder="Let us know how we can help" />

				<SofaButton padding="px-7 py-2" class="w-auto ml-auto" type="submit"> Send </SofaButton>
			</form>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import { useMetaMessage } from '@app/composables/users/metaMessage'

const { CONTACT_EMAIL, INSTAGRAM_LINK, TIKTOK_LINK, TWITTER_LINK, WHATSAPP_LINK, YOUTUBE_LINK } = $utils.constants

export default defineComponent({
	name: 'SettingsContactPage',
	routeConfig: { goBackRoute: '/settings' },
	setup() {
		useHead({
			title: 'Contact Us',
		})

		const { sendMessage, factory } = useMetaMessage()

		const socials = [
			{
				link: `mailto:${CONTACT_EMAIL}`,
				icon: 'socials-email',
			},
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

		return {
			factory,
			sendMessage,
			socials,
		}
	},
})
</script>
