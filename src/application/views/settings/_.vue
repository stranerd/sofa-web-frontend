<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Settings404',
	routeConfig: { middlewares: [() => '/settings/profile'] },
})
</script>
