<template>
	<OrganizationLayout title="Home" :index="true" />
</template>

<script lang="ts">
import OrganizationLayout from "@/components/users/organizations/OrganizationLayout.vue"
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
	components: { OrganizationLayout },
	name: "OrganizationIndexPage",
	beforeRouteEnter: generateMiddlewares(['isOrg', async () => Logic.Common.isLarge ? '/organization/dashboard' : undefined]),
	setup () {
		useMeta({
			title: "Home",
		})
	},
})
</script>