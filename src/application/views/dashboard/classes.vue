<template>
	<DashboardLayout
		title="Classes"
		rounded
		:breadcrumbs="[
			{ text: 'Home', to: '/dashboard' },
			{ text: 'Classes', to: '/dashboard/classes' },
		]"
		:primary="{ label: 'Create class', action: createClass }">
		<template #default="{ extras }">
			<div class="mdlg:mt-4 px-4 mdlg:p-0 grid grid-cols-1 mdlg:grid-cols-2 gap-4">
				<EmptyState
					v-if="!classes.length"
					image="classes"
					title="Getting started with classes"
					:sub="[
						'Teach all subjects of a class in the same place',
						'Create subjects for specific subjects',
						'Make announcements to all student at once',
						'Set a monthly subscription fee for online students',
					]"
					class="bg-white col-span-full"
					:primary="{ label: 'Create a class', action: createClass }" />

				<SofaInput
					v-if="!$screen.desktop"
					v-model="extras.searchQuery"
					placeholder="Search"
					type="search"
					class="col-span-1 !bg-white mdlg:!p-3">
					<template #prefix>
						<SofaIcon name="search" class="h-[16px]" />
					</template>
				</SofaInput>

				<ClassCard
					v-for="cl in classes.filter((m) => m.search(extras.searchQuery))"
					:key="cl.hash"
					hasShowMore
					:classInst="cl"
					class="col-span-1" />
			</div>
		</template>
	</DashboardLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ClassCard from '@app/components/organizations/classes/ClassCard.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useMyClasses } from '@app/composables/organizations/classes-explore'

export default defineComponent({
	name: 'DashboardClassesPage',
	components: { ClassCard },
	routeConfig: { goBackRoute: '/dashboard', middlewares: ['isOrg'] },
	setup() {
		const { id: organizationId } = useAuth()
		const { classes } = useMyClasses()
		const createClass = () => useModals().organizations.createClass.open({ organizationId: organizationId.value })
		return { classes, createClass }
	},
})
</script>
