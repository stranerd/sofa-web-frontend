<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Library404',
	routeConfig: { middlewares: [() => '/library/quizzes'] },
})
</script>
