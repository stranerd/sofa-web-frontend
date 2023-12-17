<template>
	<OrganizationLayout title="Teachers">
		<template v-slot="{ extras }">
			<MembersList :image="require('@/assets/images/class-teachers.png')" :type="MemberTypes.teacher"
				:members="teachers" :messages="messages" @openAddModal="extras.openAddModal"
				@acceptMember="extras.acceptMember" @removeMember="extras.removeMember" />
		</template>
	</OrganizationLayout>
</template>

<script lang="ts">
import MembersList from "@/components/organizations/members/MembersList.vue"
import OrganizationLayout from "@/components/organizations/organizations/OrganizationLayout.vue"
import { useAuth } from '@/composables/auth/auth'
import { useOrganizationMembers } from '@/composables/organizations/members'
import { generateMiddlewares } from '@/middlewares'
import { MemberTypes } from "@modules/organizations"
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
	components: { OrganizationLayout, MembersList },
	name: "OrganizationTeachersPage",
	middlewares: { goBackRoute: '/organization' },
	beforeRouteEnter: generateMiddlewares(['isOrg']),
	setup () {
		useMeta({ title: "Teachers" })

		const messages = [
			'You can assign lessons to teachers.',
			'Send announcements to all teachers at once.',
			'Teachers can make announcements to students.',
			'Manage your all teachers in the same space.'
		]

		const { id } = useAuth()
		const { teachers } = useOrganizationMembers(id.value)
		return { teachers, messages, MemberTypes }
	},
})
</script>
