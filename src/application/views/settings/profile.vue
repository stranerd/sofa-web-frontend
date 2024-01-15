<template>
	<SettingsLayout title="Profile">
		<SettingProfile />
	</SettingsLayout>
</template>

<script lang="ts">
import SettingsLayout from '@app/components/settings/SettingsLayout.vue'
import SettingProfile from '@app/components/settings/profile.vue'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'ProfileSettingPage',
	components: {
		SettingsLayout,
		SettingProfile,
	},
	routeConfig: { goBackRoute: '/settings' },
	setup() {
		useMeta({
			title: 'Profile',
		})
	},
})
</script>
