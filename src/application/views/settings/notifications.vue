<template>
	<SettingsLayout title="Notifications">
		<div class="flex flex-col px-4 w-full">
			<div class="flex justify-between items-center gap-4 bg-white rounded-2xl p-4 shadow-custom">
				<SofaHeading content="Push notifications" />
				<SofaIcon class="h-[22px]" name="toggle-on" />
			</div>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SettingsNotificationsPage',
	routeConfig: { goBackRoute: '/settings', middlewares: ['isAuthenticated'] },
	setup() {
		useHead({
			title: 'Notifications',
		})
	},
})
</script>
