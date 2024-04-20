<template>
	<div>Admin Tutors</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AdminTutorsPage',
	routeConfig: { middlewares: ['isAdmin'] },
})
</script>
