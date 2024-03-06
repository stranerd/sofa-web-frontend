<template>
	<SettingsLayout title="Contact Us">
		<div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
			<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
				<SofaHeaderText size="xl" customClass="text-left" content="Contact details" />

				<div class="w-full flex flex-row items-center gap-5 flex-wrap">
					<a v-for="social in socials" :key="social.link" :href="social.link" target="_blank">
						<SofaIcon class="h-5 fill-deepGray" :name="social.icon" />
					</a>
				</div>
			</div>

			<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
				<SofaHeaderText size="xl" customClass="text-left" content="Give feedback" />

				<SofaTextarea
					v-model="message"
					textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3"
					placeholder="Let us know how we can help" />

				<div class="w-full flex justify-end">
					<SofaButton padding="px-7 py-2" class="w-auto ml-auto" @click="sendFeedback()"> Send </SofaButton>
				</div>
			</div>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useMeta } from 'vue-meta'
import SettingsLayout from '@app/components/settings/SettingsLayout.vue'
import { CONTACT_EMAIL, INSTAGRAM_LINK, TIKTOK_LINK, TWITTER_LINK, WHATSAPP_LINK, YOUTUBE_LINK } from '@utils/constants'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'ContactUsSettingPage',
	components: { SettingsLayout },
	routeConfig: { goBackRoute: '/settings' },
	setup() {
		useMeta({
			title: 'Contact Us',
		})

		const message = ref('')

		const sendFeedback = () => {
			if (message.value.length > 7) {
				Logic.Users.SendFeedbackMessage(message.value).then(() => {
					message.value = ''
				})
			}
		}

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

		onMounted(() => {
			if (Logic.Common.route.query?.query?.toString()) {
				message.value = Logic.Common.route.query?.query?.toString()
			}
		})
		return {
			message,
			sendFeedback,
			socials,
		}
	},
})
</script>
