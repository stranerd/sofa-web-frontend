<template>
	<SettingsLayout title="Organizations">
		<div class="w-full flex flex-col gap-4 px-4 mdlg:px-0">
			<div
				class="w-full flex flex-col gap-4 mdlg:bg-white mdlg:rounded-2xl mdlg:p-4 mdlg:shadow-custom"
				:class="{ 'bg-white rounded-[8px] p-3': organizations.length > 0 }">
				<SofaHeaderText size="xl" cass="mx-auto hidden mdlg:flex" content="Organizations" />

				<div v-if="organizations.length" class="w-full flex flex-col gap-4">
					<div v-for="org in organizations" :key="org.id" class="w-full flex gap-2 items-center">
						<SofaAvatar :photoUrl="org.photo" :size="23" />
						<SofaNormalText :content="org.name" class="truncate flex-1" />
						<SofaNormalText as="a" content="Leave" color="text-primaryRed" @click="leaveOrganization" />
					</div>
				</div>
				<SofaEmptyState v-else title="No organization" subTitle="Your are not a member of any organization" />
			</div>
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useMyOrganizations } from '@app/composables/users/organizations'

export default defineComponent({
	name: 'SettingsOrganizationsPage',
	routeConfig: { goBackRoute: '/settings', middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({ title: 'Organizations' })
		const { organizations, leaveOrganization } = useMyOrganizations()
		return { organizations, leaveOrganization }
	},
})
</script>
