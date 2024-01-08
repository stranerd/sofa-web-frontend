<template>
	<!-- create item action -->
	<sofa-modal :close="() => close?.()" :can-close="true">
		<div
			class="mdlg:!w-[60%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative"
			@click.stop="
				() => {
					//
				}
			">
			<div
				class="bg-white w-full flex flex-col lg:!px-6 md:!gap-4 gap-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
				<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
					<sofa-header-text :custom-class="'text-xl'" content="Create study material" />
				</div>

				<div
					class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-lightGray border-b px-4">
					<sofa-normal-text :custom-class="'!font-bold !text-base'"> Create study material </sofa-normal-text>
					<sofa-icon :custom-class="'h-[19px]'" :name="'circle-close'" @click="close ? close() : null" />
				</div>

				<div class="w-full flex flex-col gap-3 px-4 py-4">
					<sofa-icon-card
						v-for="(item, index) in studyMaterialItems"
						:key="index"
						:data="item"
						:custom-class="'!bg-lightGray !w-full !shadow-none'"
						@click="
							() => {
								item.action()
								showAddItem = false
							}
						">
						<template #title>
							<sofa-normal-text :custom-class="'!font-bold'">
								{{ item.title }}
							</sofa-normal-text>
						</template>
					</sofa-icon-card>
				</div>
			</div>
		</div>
	</sofa-modal>
</template>
<script lang="ts">
import { showAddItem } from '@/composables'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaIcon, SofaIconCard, SofaModal, SofaNormalText } from 'sofa-ui-components'
import { defineComponent, ref } from 'vue'

export default defineComponent({
	components: {
		SofaModal,
		SofaIcon,
		SofaNormalText,
		SofaHeaderText,
		SofaIconCard,
	},
	props: {
		close: {
			type: Function,
			default: null,
		},
	},
	setup() {
		const studyMaterialItems = ref([
			{
				title: 'Create a quiz',
				subTitle: 'Build a customized quiz with different question types and study modes',
				icon: 'pink-question',
				iconSize: 'h-[46px]',
				action: () => {
					Logic.Common.GoToRoute('/quiz/create')
				},
			},
			{
				title: 'Create a course',
				subTitle: 'Develop and publish a series of educational material on a particular subject',
				icon: 'orange-list',
				iconSize: 'h-[46px]',
				action: () => {
					Logic.Common.GoToRoute('/course/create')
				},
			},
		])
		return {
			studyMaterialItems,
			showAddItem,
		}
	},
})
</script>
