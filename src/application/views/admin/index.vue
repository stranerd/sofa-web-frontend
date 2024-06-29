<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AdminIndexPage',
	routeConfig: { middlewares: [() => '/admin/accounts/admins'] },
})
</script>
