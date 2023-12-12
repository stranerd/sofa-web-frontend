<template>
	<OrganizationLayout title="Dashboard">
		<span class="text-bodyBlack">Dashboard</span>
	</OrganizationLayout>
</template>

<script lang="ts">
import OrganizationLayout from "@/components/users/organizations/OrganizationLayout.vue"
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
	components: { OrganizationLayout },
	name: "OrganizationDashboardPage",
	middlewares: { goBackRoute: '/organization' },
	beforeRouteEnter: generateMiddlewares(['isOrg']),
	setup () {
		useMeta({
			title: "Home",
		})
	},
})
</script>
