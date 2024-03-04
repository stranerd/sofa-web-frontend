<template>
	<SofaImageLoader
		:as="userId ? 'router-link' : as"
		:to="`/profile/${userId}`"
		:photoUrl="photoUrl ?? ''"
		class="shrink-0 rounded-full flex text-xs uppercase font-semibold bg-opacity-10 cursor-pointer items-center justify-center relative"
		:customClass="`${bgColor} ${customClass}`"
		:customStyle="`width: ${size}px; height: ${size}px;`">
		<template v-if="!photoUrl">
			<slot>
				<SofaIcon class="w-1/2 h-1/2" name="user" />
			</slot>
		</template>
		<span
			v-if="showOnline"
			class="size-[5px] absolute bottom-0 right-0 rounded-full"
			:class="online ? 'bg-primaryGreen' : 'bg-grayColor'" />
	</SofaImageLoader>
</template>

<script lang="ts" setup>
import SofaImageLoader from '../SofaImageLoader/index.vue'
import SofaIcon from '../SofaIcon'

withDefaults(
	defineProps<{
		as?: string
		size?: string
		photoUrl?: string | null
		customClass?: string
		bgColor?: string
		userId?: string
		showOnline?: boolean
		online?: boolean
	}>(),
	{
		as: 'div',
		size: '50',
		photoUrl: '',
		customClass: '',
		bgColor: 'bg-grayColor',
		userId: '',
		showOnline: false,
		online: false,
	},
)
</script>
