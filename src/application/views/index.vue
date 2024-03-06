<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'IndexPage',
	routeConfig: { middlewares: [async () => `/home/students`] },
})
</script>
