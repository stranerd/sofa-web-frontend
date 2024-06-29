<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Admin404Page',
	routeConfig: { middlewares: [() => '/admin/accounts/admins'] },
})
</script>
