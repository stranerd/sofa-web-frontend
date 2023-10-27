<template>
	<div>Admin Tutors</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { generateMiddlewares } from '../../middlewares'

export default defineComponent({
	name: 'AdminTutors',
	beforeRouteEnter: generateMiddlewares([async () => {
		console.log('AdminTutors')
	}]),
	setup () {
		return {}
	}
})
</script>