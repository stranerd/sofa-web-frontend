<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'HomeIndexPage',
	routeConfig: { middlewares: [() => `/home/students`] },
})
</script>
