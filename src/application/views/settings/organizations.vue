<template>
	<SettingsLayout title="Organizations">
		<div class="w-full flex flex-col gap-4 px-4 mdlg:px-0">
			<div
				class="w-full flex flex-col gap-4 mdlg:bg-white mdlg:rounded-2xl mdlg:p-4 mdlg:shadow-custom"
				:class="{ 'bg-white rounded-[8px] p-3': organizations.length > 0 }">
				<SofaHeading v-if="$screen.desktop" size="title" cass="mx-auto" content="Organizations" />

				<div v-if="organizations.length" class="w-full flex flex-col gap-4">
					<div v-for="org in organizations" :key="org.id" class="w-full flex gap-2 items-center">
						<SofaAvatar :photoUrl="org.photo" :size="23" />
						<SofaText clamp :content="org.name" class="flex-1" />
						<SofaText as="a" content="Leave" class="text-primaryRed" @click="leaveOrganization" />
					</div>
				</div>
				<SofaEmptyState v-else title="No organization" subTitle="Your are not a member of any organization" />
			</div>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import { useMyOrganizations } from '@app/composables/users/organizations'

export default defineComponent({
	name: 'SettingsOrganizationsPage',
	routeConfig: { goBackRoute: '/settings', middlewares: ['isAuthenticated'] },
	setup() {
		useHead({ title: 'Organizations' })
		const { organizations, leaveOrganization } = useMyOrganizations()
		return { organizations, leaveOrganization }
	},
})
</script>
