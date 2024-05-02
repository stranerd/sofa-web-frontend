<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdSubjectsSubjectIdIndex',
	routeConfig: {
		middlewares: [
			({ to }) =>
				`/organizations/${to.params.organizationId}/classes/${to.params.classId}/subjects/${to.params.subjectId}/curriculum`,
		],
	},
})
</script>
