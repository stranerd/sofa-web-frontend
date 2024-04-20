<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Library404Page',
	routeConfig: { middlewares: [() => '/library/quizzes'] },
})
</script>
