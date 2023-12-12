<template>
	<div />
</template>

<script lang="ts">
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Settings404',
	beforeRouteEnter: generateMiddlewares([async () => '/settings/profile']),
})
</script>
