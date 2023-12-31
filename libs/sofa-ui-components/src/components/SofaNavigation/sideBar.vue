<template>
	<span class="flex flex-row gap-2 items-center pt-2">
		<img :src="logoPath" :class="`${logoSize}`" />
	</span>

	<div class="flex flex-col gap-3 pt-8">
		<div v-for="tab in tabs" :key="tab.name" :class="`flex flex-col`" @mouseover="hoverTab = tab.icon" @mouseleave="hoverTab = ''">
			<router-link
				:to="tab.path"
				:class="`flex flex-row py-2 items-center px-4 gap-3 rounded w-full ${
					tabIsActive(tab.routeTag) ? 'bg-white rounded-md' : ''
				} `"
				@click="tab.showSub ? (tab.showSub = false) : (tab.showSub = true)">
				<span>
					<sofa-icon
						:name="tabIsActive(tab.routeTag) ? tab.icon : `${tab.icon}-white`"
						:custom-class="` ${tab.icon_size ? tab.icon_size : 'lg:h-[19px] mdlg:h-[19px]'} `" />
				</span>
				<sofa-normal-text
					custom-class="pt-[2px] "
					:color="`${tabIsActive(tab.routeTag) ? 'text-bodyDark font-semibold' : 'text-white '}`">
					{{ tab.name }}
				</sofa-normal-text>
			</router-link>
			<template v-if="tab.showSub">
				<router-link
					v-for="(sub, index) in tab.sub"
					:key="index"
					:to="sub.path"
					:class="`flex flex-row py-2 items-center px-4 gap-3 rounded w-full  ${tabIsActive(sub.path) ? ' rounded-md' : ''} `">
					<span :class="`w-[6px] h-[6px] rounded-full ${tabIsActive(sub.path) ? 'bg-white' : 'bg-gray-400 '}`"> </span>
					<sofa-normal-text custom-class="pt-[2px] " :color="`${tabIsActive(sub.path) ? 'text-white' : 'text-gray-400'}`">
						{{ sub.name }}
					</sofa-normal-text>
				</router-link>
			</template>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import SofaIcon from '../SofaIcon/index.vue'
import SofaNormalText from '../SofaTypography/normalText.vue'

export default defineComponent({
	name: 'SofaSideBar',
	components: {
		SofaNormalText,
		SofaIcon,
	},
	props: {
		tabIsActive: {
			type: Function,
			required: true,
		},
		tabs: {
			type: Array as () => any[],
			required: true,
		},
		logoPath: {
			type: String,
			default: '/images/icons/squareSofa-logo.svg',
		},
		logoSize: {
			type: String,
			default: 'h-[22px]',
		},
	},
	setup() {
		const hoverTab = ref('')

		return {
			hoverTab,
		}
	},
})
</script>
