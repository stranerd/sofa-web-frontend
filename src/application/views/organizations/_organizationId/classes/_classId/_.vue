<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassId404Page',
	routeConfig: { middlewares: [({ to }) => `/organizations/${to.params.organizationId}/classes/${to.params.classId}/`] },
})
</script>
