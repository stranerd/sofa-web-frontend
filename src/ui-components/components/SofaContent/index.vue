<template>
	<div class="w-full flex flex-col gap-3 pb-4">
		<div class="flex flex-row items-center justify-between">
			<div class="flex flex-row items-center gap-3">
				<SofaNormalText> {{ data.sections.length }} sections </SofaNormalText>
				<span class="h-[5px] w-[5px] rounded-full bg-bodyBlack"> </span>
				<SofaNormalText>{{ data.materialsCount }} materials</SofaNormalText>
			</div>

			<!-- <sofa-normal-text :color="'text-primaryPink'">
        Expand all sections
      </sofa-normal-text> -->
		</div>

		<div v-for="(section, index) in data.sections" :key="index" class="w-full flex flex-col gap-3">
			<div
				class="w-full bg-lightGray cursor-pointer rounded-custom px-4 py-4 flex flex-row items-center justify-between"
				@click.stop="section.opened ? (section.opened = false) : (section.opened = true)">
				<SofaNormalText customClass="!font-bold text-left !line-clamp-1">
					{{ section.title }}
				</SofaNormalText>

				<div class="flex flex-row items-center gap-2">
					<SofaNormalText>{{ section.data.length }} materials </SofaNormalText>
					<SofaIcon customClass="h-[7px]" :name="section.opened ? 'chevron-up' : 'chevron-down'" />
				</div>
			</div>

			<template v-if="section.opened">
				<div
					v-for="(eachData, i) in section.data"
					:key="i"
					class="w-full bg-lightGray rounded-custom px-4 py-4 flex flex-row items-center justify-between">
					<div :class="`flex flex-row items-center gap-3 ${!hasAccess ? 'opacity-50' : ''}`">
						<SofaIcon customClass="h-[42px]" :name="`${eachData.type.toLowerCase()}-content` as any" />
						<div class="flex flex-col gap-1">
							<SofaNormalText customClass="!font-bold text-left  !line-clamp-1">{{ eachData.title }}</SofaNormalText>
							<div class="flex flex-row items-center gap-2">
								<SofaNormalText
									v-if="!Logic.Common.isOnlyMobile"
									color="text-grayColor"
									customClass="text-left !line-clamp-1">
									{{ eachData.type }}
								</SofaNormalText>
								<span
									v-if="!Logic.Common.isOnlyMobile"
									class="h-[5px] w-[5px] rounded-full bg-grayColor hidden md:!inline-block">
								</span>
								<SofaNormalText color="text-grayColor" customClass="text-left !line-clamp-1">
									{{ eachData.sub }}
								</SofaNormalText>
							</div>
						</div>
					</div>

					<SofaIcon v-if="!hasAccess" customClass="h-[40px]" name="locked-content" />
				</div>
			</template>
		</div>

		<!-- <div class="w-full !h-[100px]"></div> -->
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SofaIcon from '../SofaIcon'
import { SofaNormalText } from '../SofaTypography'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'SofaContent',
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
	setup() {
		return {
			Logic,
		}
	},
})
</script>
