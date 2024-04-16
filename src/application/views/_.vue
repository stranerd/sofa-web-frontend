<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: '404Page',
	routeConfig: { middlewares: [() => '/dashboard'] },
})
</script>
