<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdSubjectsSubjectId404Page',
	routeConfig: {
		middlewares: [
			({ to }) => `/organizations/${to.params.organizationId}/classes/${to.params.classId}/subjects/${to.params.subjectId}/`,
		],
	},
})
</script>
