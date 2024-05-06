<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdIndex',
	routeConfig: {
		middlewares: [({ to }) => `/organizations/${to.params.organizationId}/classes/${to.params.classId}/subjects`],
	},
})
</script>
