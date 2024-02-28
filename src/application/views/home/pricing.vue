<template>
	<main class="w-full flex flex-col gap-[50px] mdlg:gap-[150px] bg-white max-w-[1800px] mx-auto">
		<header class="flex flex-col items-center justify-center relative">
			<HomeNavbar class="mb-[44px]" />
			<!-- Link -->
			<div
				class="flex items-center bg-white mt-[44px] h-[44px] rounded-[22px] w-[268px] overflow-hidden mb-[44px]"
				style="box-shadow: 0px 4px 16px 0px #00000040">
				<button
					class="w-1/2 h-full flex items-center justify-center p-5 rounded-[22px] text-[14px] md:text-[16px]"
					:class="showStudentsPricing ? 'bg-purple text-white' : ''"
					@click="showStudentsPricing = true">
					Students
				</button>
				<button
					class="w-1/2 h-full flex items-center justify-center p-5 text-[14px] rounded-[22px] md:text-[16px]"
					:class="!showStudentsPricing ? 'bg-purple text-white' : ''"
					@click="showStudentsPricing = false">
					Organizations
				</button>
			</div>
			<div
				class="relative flex justify-center"
				:class="showStudentsPricing ? 'items-center mdlg:min-h-[500px]' : 'items-start mdlg:min-h-[300px]'">
				<div class="w-[90%] sm:w-[80%] md:w-[60%] mx-auto flex flex-col mdlg:flex-row items-center gap-10">
					<div
						ref="first_plan"
						:key="showStudentsPricing.toString()"
						class="w-full mdlg:w-1/2 bg-white flex flex-col gap-6 px-6 rounded-[20px]"
						style="box-shadow: 0px 0px 24px 0px #00000040; z-index: 999999 !important">
						<div class="flex gap-3 justify-between">
							<div class="flex flex-col gap-2 pt-3">
								<h2 class="text-[20px] font-bold">{{ plan.basic.title }}</h2>
								<p class="text-[#686969] text-[14px]">
									{{ plan.basic.desc }}
								</p>
							</div>
							<div class="bg-[#008000] w-[80px] gap-1 px-2 rounded-b-[12px] text-center relative">
								<div class="absolute left-0 right-0 bottom-0 pb-1 px-1">
									<p class="text-white font-bold">{{ plan.basic.price }}</p>
									<p class="text-white text-[10px]">{{ plan.basic.duration }}</p>
								</div>
							</div>
						</div>
						<ul class="flex flex-col gap-3">
							<li v-for="benefit in plan.basic.benefits" :key="benefit" class="flex items-center gap-2">
								<SofaIcon name="checkmark-circle" class="h-[16px]" />
								<p class="text-[14px]">{{ benefit }}</p>
							</li>
						</ul>
						<button class="w-full bg-purple text-white py-[10px] rounded-lg mb-3">Choose Plan</button>
					</div>
					<div
						class="w-full mdlg:w-1/2 bg-white flex flex-col gap-6 px-6 rounded-[20px]"
						style="box-shadow: 0px 0px 24px 0px #00000040; z-index: 999999 !important">
						<div class="flex gap-3 justify-between">
							<div class="flex flex-col pt-3 gap-2">
								<h2 class="text-[20px] font-bold">{{ plan.plus.title }}</h2>
								<p class="text-[#686969] text-[14px]">
									{{ plan.plus.desc }}
								</p>
							</div>
							<div class="bg-purple w-[80px] gap-1 px-2 pt-6 rounded-b-[12px] text-center relative">
								<div class="absolute left-0 right-o bottom-0 px-1 pb-1">
									<p class="text-white font-bold">{{ plan.plus.price }}</p>
									<p class="text-white text-[10px]">{{ plan.plus.duration }}</p>
								</div>
							</div>
						</div>
						<ul class="flex flex-col gap-3">
							<li v-for="benefit in plan.plus.benefits" :key="benefit" class="flex items-center gap-2">
								<SofaIcon name="checkmark-circle" class="h-[16px] !fill-purple" />
								<p class="text-[14px]">{{ benefit }}</p>
							</li>
						</ul>
						<button class="w-full bg-purple text-white py-[10px] rounded-lg mb-3">Choose Plan</button>
					</div>
					<div
						class="absolute w-full mdlg:w-[927px] mx-auto left-0 right-0 styled-bg rounded-[20px]"
						style="z-index: 100"
						:class="[showStudentsPricing ? 'h-[350px]' : 'h-[200px]']"
						:style="dynamicStyle"></div>
				</div>
				<img
					class="hidden mdlg:block absolute left-0"
					:class="showStudentsPricing ? 'bottom-0' : '-bottom-40'"
					src="/images/arrow-svg.png" />
			</div>
			<img class="hidden mdlg:block absolute top-[80px] right-0" src="/images/smiles.png" />
		</header>
		<HomeDiscoverMaterials />
		<div class="w-[90%] mx-auto relative">
			<HomeJoinUs class="w-[80%] mx-auto" />
			<img class="hidden mdlg:block absolute left-0 bottom-10" src="/images/pricing-left.png" />
			<img class="hidden mdlg:block absolute -top-16 right-0" src="/images/skewed-green-box.png" />
		</div>
		<HomeFooter />
	</main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
const showStudentsPricing = ref(true)

const student_plan = ref({
	basic: {
		title: 'Nerd Basic',
		desc: 'Nerd basic is a free plan  for students to have access to unlimited resources',
		benefits: [
			'Pay as you go tutoring',
			'Unlimited access to out Nerd AI',
			'Create and study with unlimited quizzes, flashcards, and practice tests',
			'Multiplayer quiz games with friends',
			'Access to our academic marketplace',
			'Access to unlimited number of classes(JAMB, WAEC, SAT, etc)',
		],
		price: 'Free',
		duration: 'plan',
	},
	plus: {
		title: 'Nerd Plus',
		desc: 'Nerd Plus is a premium plan  for students to have access to unlimited resources.',
		benefits: [
			'Pay as you go tutoring',
			'Unlimited access to out Nerd AI',
			'Create and study with unlimited quizzes, flashcards, and practice tests',
			'Multiplayer quiz games with friends',
			'Access to our academic marketplace',
			'Access to unlimited number of classes(JAMB, WAEC, SAT, etc)',
			'3 Tutoring sesions(Hybrid)',
			'Stranerd Created content',
		],
		price: '$1.99',
		duration: 'Per Month',
	},
})

const org_plan = ref({
	basic: {
		title: 'Nerd Suite',
		desc: 'Nerd basic is a free plan  for students to have access to unlimited resources',
		benefits: ['Students have access to all created materials and resources by your organization'],
		price: '$1.99',
		duration: 'Per student per month',
	},
	plus: {
		title: 'Nerd Plus',
		desc: 'Nerd Plus is a premium plan  for students to have access to unlimited resources.',
		benefits: ['Access to live classes', 'Students have access to class recordings all materials associated with that class.'],
		price: '$3.99',
		duration: 'Per student per month',
	},
})

const plan = computed(() => {
	if (showStudentsPricing.value) {
		return student_plan.value
	} else {
		return org_plan.value
	}
})
const first_plan = ref<HTMLDivElement | null>(null)
const height = computed(() => first_plan.value?.clientHeight || 0)
const windowWidth = ref(window.innerWidth)
const dynamicStyle = computed(() => {
	if (windowWidth.value <= 1000) {
		return {
			top: `${(height.value + 40) / 2}px`,
		}
	}
	return {}
})
const updateWindowWidth = () => {
	windowWidth.value = window.innerWidth
}

onMounted(() => {
	window.addEventListener('resize', updateWindowWidth)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
.styled-bg {
	background: url('/images/layer.png'), linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
