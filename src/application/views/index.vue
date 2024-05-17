<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '@app/composables/auth/auth'

export default defineComponent({
	name: 'IndexPage',
	routeConfig: {
		middlewares: [
			() => {
				const { isLoggedIn } = useAuth()
				return isLoggedIn.value ? '/dashboard' : '/home'
			},
		],
	},
})
</script>
