<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'IndexPage',
	routeConfig: { middlewares: [() => '/home'] },
})
</script>
