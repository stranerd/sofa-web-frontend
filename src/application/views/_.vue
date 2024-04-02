<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: '404',
	routeConfig: { middlewares: [() => '/dashboard'] },
})
</script>
