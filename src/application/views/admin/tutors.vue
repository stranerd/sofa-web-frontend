<template>
	<div>Admin Tutors</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AdminTutors',
	routeConfig: { middlewares: ['isAdmin'] },
	setup() {
		return {}
	},
})
</script>
