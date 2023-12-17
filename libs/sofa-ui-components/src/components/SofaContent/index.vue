<template>
	<div class="w-full flex flex-col gap-3 pb-4">
		<div class="flex flex-row items-center justify-between">
			<div class="flex flex-row items-center gap-3">
				<sofa-normal-text>
					{{ data.sections.length }} sections
				</sofa-normal-text>
				<span :class="`h-[5px] w-[5px] rounded-full bg-bodyBlack`"> </span>
				<sofa-normal-text>{{ data.materialsCount }} materials</sofa-normal-text>
			</div>

			<!-- <sofa-normal-text :color="'text-primaryPink'">
        Expand all sections
      </sofa-normal-text> -->
		</div>

		<div class="w-full flex flex-col gap-3" v-for="(section, index) in data.sections" :key="index">
			<div class="w-full bg-lightGray cursor-pointer rounded-custom px-4 py-4 flex flex-row items-center justify-between"
				@click.stop="
					section.opened ? (section.opened = false) : (section.opened = true)
				">
				<sofa-normal-text :customClass="'!font-bold text-left !line-clamp-1'">
					{{ section.title }}
				</sofa-normal-text>

				<div class="flex flex-row items-center gap-2">
					<sofa-normal-text>{{ section.data.length }} materials
					</sofa-normal-text>
					<sofa-icon :customClass="'h-[7px]'" :name="section.opened ? 'chevron-up' : 'chevron-down'" />
				</div>
			</div>

			<template v-if="section.opened">
				<div :class="`w-full bg-lightGray rounded-custom px-4 py-4 flex flex-row items-center justify-between   `"
					v-for="(eachData, index) in section.data" :key="index">
					<div :class="`flex flex-row items-center gap-3 ${!hasAccess ? 'opacity-50' : ''
					}`">
						<sofa-icon :customClass="'h-[42px]'" :name="`${eachData.type.toLowerCase()}-content`" />
						<div class="flex flex-col gap-1">
							<sofa-normal-text :customClass="'!font-bold text-left  !line-clamp-1'">{{ eachData.title
							}}</sofa-normal-text>
							<div class="flex flex-row items-center gap-2">
								<sofa-normal-text :color="'text-grayColor'" v-if="!Logic.Common.isOnlyMobile"
									:customClass="'text-left !line-clamp-1 '">{{ eachData.type }}
								</sofa-normal-text>
								<span v-if="!Logic.Common.isOnlyMobile"
									:class="`h-[5px] w-[5px] rounded-full bg-grayColor  hidden md:!inline-block`">
								</span>
								<sofa-normal-text :color="'text-grayColor'" :customClass="'text-left !line-clamp-1'">{{ eachData.sub }}
								</sofa-normal-text>
							</div>
						</div>
					</div>

					<sofa-icon :customClass="'h-[40px]'" v-if="!hasAccess" :name="'locked-content'" />
				</div>
			</template>
		</div>

		<!-- <div class="w-full !h-[100px]"></div> -->
	</div>
</template>
<script lang="ts">
import { Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import SofaIcon from '../SofaIcon'
import { SofaNormalText } from '../SofaTypography'

export default defineComponent({
	components: {
		SofaIcon,
		SofaNormalText,
	},
	props: {
		customClass: {
			type: String,
			default: 'bg-lightGray',
		},
		data: {
			type: Object as () => any,
			required: true,
		},
		hasAccess: {
			type: Boolean,
			default: false,
		},
	},
	name: 'SofaContent',
	setup () {
		return {
			Logic,
		}
	},
})
</script>
