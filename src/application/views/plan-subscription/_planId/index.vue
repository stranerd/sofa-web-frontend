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
import { defineComponent, watch } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import { usePlan } from '@app/composables/payment/plans'
export default defineComponent({
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		useMeta({
			title: 'Plan Subscription',
		})

		const route = useRoute()
		const planId = route.params.planId as string

		const { plan } = usePlan(planId)
		watch(plan, () => {
			console.log(plan.value)
		})
	},
})
</script>
