<template>
	<div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'TestsIdIndexPage',
	routeConfig: { middlewares: [({ to }) => `/tests/${to.params.id}/lobby`] },
})
</script>
