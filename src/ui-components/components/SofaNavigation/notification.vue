<template>
	<div class="w-full flex flex-col gap-1 relative overflow-y-auto h-full flex-grow">
		<div class="w-full flex flex-row items-center justify-between sticky top-0 left-0 bg-white py-3 z-10">
			<SofaHeaderText customClass="!font-bold !text-base"> Notifications </SofaHeaderText>
			<SofaIcon customClass="h-[19px] cursor-pointer" name="circle-close" @click="close ? close() : null" />
		</div>
		<div v-if="AllNotifications?.results.length" class="w-full flex flex-col gap-3">
			<div
				v-for="(item, index) in AllNotifications.results"
				:key="index"
				:class="`w-full flex flex-row items-start justify-between ${item.seen ? 'opacity-80' : ''}`">
				<div class="flex flex-col gap-1">
					<SofaNormalText customClass="text-left">
						{{ item.body }}
					</SofaNormalText>
					<SofaNormalText color="text-grayColor" customClass="!text-left">
						{{ formatTime(item.createdAt) }}
					</SofaNormalText>
				</div>
				<div v-if="!item.seen" class="flex flex-col">
					<span class="h-[8px] w-[8px] rounded-full bg-primaryBlue"> </span>
				</div>
			</div>
		</div>
		<div v-else class="w-full flex flex-col gap-2 flex-grow items-center justify-center h-full">
			<SofaIcon name="empty-notification" customClass="h-[48px]" />
			<SofaNormalText color="text-grayColor" customClass="!text-center"> You have no notifications </SofaNormalText>
		</div>
	</div>
</template>
<script lang="ts">
import { formatTime } from '@utils/dates'
import { Logic } from 'sofa-logic'
import { defineComponent, onMounted, ref } from 'vue'
import SofaIcon from '../SofaIcon'
import { SofaHeaderText, SofaNormalText } from '../SofaTypography'

export default defineComponent({
	components: {
		SofaIcon,
		SofaNormalText,
		SofaHeaderText,
	},
	props: {
		close: {
			type: Function,
			required: true,
		},
	},
	setup() {
		const AllNotifications = ref(Logic.Notifications.AllNotifications)

		onMounted(() => {
			// mark all notifications as seen
			Logic.Notifications.ToggleAllNotifications(true)
		})

		return {
			AllNotifications,
			Logic,
			formatTime,
		}
	},
})
</script>
