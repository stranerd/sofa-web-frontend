<template>
	<DashboardLayout :topbarOptions="{ title: 'Checkout' }">
		<template #left-session>
			<span />
		</template>

		<template #right-session>
			<span />
		</template>
		<template #middle-session>
			<div class="w-full bg-white shadow-custom rounded-custom p-4 mdlg:p-6"></div>
		</template>
	</DashboardLayout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
export default defineComponent({
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		useMeta({
			title: 'Plan Subscription',
		})
	},
})
</script>
