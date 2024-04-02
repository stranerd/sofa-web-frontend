<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Auth404',
	routeConfig: { middlewares: [() => '/auth/signin'] },
})
</script>
