<template>
	<div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'PlaysTypeIndexPage',
	routeConfig: { middlewares: [({ to }) => `/plays/${to.params.type}/${to.params.id}/lobby`] },
})
</script>
