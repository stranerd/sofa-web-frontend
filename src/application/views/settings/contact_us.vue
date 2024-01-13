<template>
	<SettingsLayout title="Contact Us">
		<setting-contact />
	</SettingsLayout>
</template>

<script lang="ts">
import SettingsLayout from '@/components/settings/SettingsLayout.vue'
import SettingContact from '@/components/settings/contact.vue'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'ContactUsSettingPage',
	components: {
		SettingsLayout,
		SettingContact,
	},
	routeConfig: { goBackRoute: '/settings' },
	setup() {
		useMeta({
			title: 'Contact Us',
		})
	},
})
</script>
