<template>
	<SettingsLayout title="Contact Us">
		<SettingContact />
	</SettingsLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import SettingsLayout from '@app/components/settings/SettingsLayout.vue'
import SettingContact from '@app/components/settings/contact.vue'

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
