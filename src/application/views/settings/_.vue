<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Settings404Page',
	routeConfig: { middlewares: [() => '/settings/profile'] },
})
</script>
