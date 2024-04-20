<template>
	<LibraryLayout
		:title="user?.publicName ?? 'Not found'"
		:options="[
			{ name: 'All', id: 'all' },
			{ name: 'Courses', id: 'courses' },
			{ name: 'Quizzes', id: 'quizzes' },
		]">
		<template v-if="data.length">
			<StudyMaterialCard
				v-for="activity in data"
				:key="activity.hash"
				type="activity"
				:material="activity"
				:isWrapped="!$screen.desktop"
				:isRoute="false"
				:hasShowMore="true"
				class="mdlg:!bg-white"
				@click.stop="openMaterial(activity)" />
		</template>

		<SofaEmptyState
			v-else
			title="This organization has no items"
			subTitle="Whenever this organization creates an item, you will see it here" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { openMaterial } from '@app/composables/study/library'
import { useUsersMaterials } from '@app/composables/study/users-materials'

export default defineComponent({
	name: 'LibraryOrganizationsIdPage',
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { user, courses, quizzes } = useUsersMaterials(route.params.id as string)

		const data = computed(() => {
			if (tab.value === 'all') return [...courses, ...quizzes].sort((a, b) => b.createdAt - a.createdAt)
			if (tab.value === 'courses') return courses
			if (tab.value === 'quizzes') return quizzes
			return []
		})

		return { user, openMaterial, data }
	},
})
</script>
