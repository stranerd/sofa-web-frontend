<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Auth404Page',
	routeConfig: { middlewares: [() => '/auth/signin'] },
})
</script>
