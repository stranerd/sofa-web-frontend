<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdCoursesCourseId404Page',
	routeConfig: {
		middlewares: [({ to }) => `/organizations/${to.params.organizationId}/classes/${to.params.classId}/courses/${to.params.courseId}/`],
	},
})
</script>
