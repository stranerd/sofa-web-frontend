<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdCoursesCourseIdIndex',
	routeConfig: {
		middlewares: [
			({ to }) => `/organizations/${to.params.organizationId}/classes/${to.params.classId}/courses/${to.params.courseId}/curriculum`,
		],
	},
})
</script>
