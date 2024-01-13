<template>
	<div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'GamesIdIndexPage',
	routeConfig: { middlewares: [({ to }) => `/games/${to.params.id}/lobby`] },
})
</script>
