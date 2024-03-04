<template>
	<main class="w-full flex flex-col gap-[50px] mdlg:gap-[150px] bg-white max-w-[1800px] mx-auto">
		<header class="flex flex-col items-center justify-center relative gap-[44px]">
			<HomeNavbar />
			<!-- Link -->
			<div
				class="flex items-center bg-white h-[44px] rounded-[22px] w-[268px] overflow-hidden"
				style="box-shadow: 0 4px 16px 0 #00000040">
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
						v-if="plan.basic"
						ref="firstPlan"
						:key="showStudentsPricing.toString()"
						class="w-full mdlg:w-1/2 bg-white flex flex-col gap-6 px-6 rounded-[20px]"
						style="box-shadow: 0 0 24px 0 #00000040; z-index: 999999 !important">
						<div class="flex gap-3 justify-between">
							<div class="flex flex-col gap-2 pt-3">
								<h2 class="text-[20px] font-bold">{{ plan.basic.title }}</h2>
								<p class="text-[#686969] text-[14px]">
									{{ plan.basic.description }}
								</p>
							</div>
							<div class="bg-[#008000] w-[80px] gap-1 px-2 rounded-b-[12px] text-center relative">
								<div class="absolute left-0 right-0 bottom-0 pb-1 px-1">
									<p class="text-white font-bold">{{ plan.basic.amount > 0 ? plan.basic.amount : 'Free' }}</p>
									<p class="text-white text-[10px]">{{ plan.basic.amount > 0 ? 'per month per student' : 'plan' }}</p>
								</div>
							</div>
						</div>
						<ul class="flex flex-col gap-3">
							<li v-for="feature in plan.basic.features" :key="feature" class="flex items-center gap-2">
								<SofaIcon name="checkmark-circle" class="h-[16px]" />
								<p class="text-[14px]">{{ feature }}</p>
							</li>
						</ul>
						<button class="w-full bg-purple text-white py-[10px] rounded-lg mb-3" @click="choosePlan(plan.basic)">
							Choose Plan
						</button>
					</div>
					<div
						v-if="plan.plus"
						class="w-full mdlg:w-1/2 bg-white flex flex-col gap-6 px-6 rounded-[20px]"
						style="box-shadow: 0 0 24px 0 #00000040; z-index: 999999 !important">
						<div class="flex gap-3 justify-between">
							<div class="flex flex-col pt-3 gap-2">
								<h2 class="text-[20px] font-bold">{{ plan.plus.title }}</h2>
								<p class="text-[#686969] text-[14px]">
									{{ plan.plus.description }}
								</p>
							</div>
							<div class="bg-purple w-[80px] gap-1 px-2 pt-6 rounded-b-[12px] text-center relative">
								<div class="absolute left-0 right-o bottom-0 px-1 pb-1">
									<p class="text-white font-bold">{{ plan.plus.amount > 0 ? plan.plus.amount : 'Free' }}</p>
									<p class="text-white text-[10px]">{{ plan.plus.amount > 0 ? 'per month per student' : 'plan' }}</p>
								</div>
							</div>
						</div>
						<ul class="flex flex-col gap-3">
							<li v-for="feature in plan.plus.features" :key="feature" class="flex items-center gap-2">
								<SofaIcon name="checkmark-circle" class="h-[16px] !fill-purple" />
								<p class="text-[14px]">{{ feature }}</p>
							</li>
						</ul>
						<button class="w-full bg-purple text-white py-[10px] rounded-lg mb-3" @click="choosePlan(plan.plus)">
							Choose Plan
						</button>
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
			<HomeJoinUs class="w-full md:w-[90%] mx-auto" />
			<img class="hidden mdlg:block absolute left-0 bottom-10" src="/images/pricing-left.png" />
			<img class="hidden mdlg:block absolute -top-16 right-0" src="/images/skewed-green-box.png" />
		</div>
		<HomeFooter />
	</main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlansList } from '@app/composables/payment/plans'
import { PlanEntity } from '@modules/payment'
import { Logic } from 'sofa-logic'

const { studentsPlans, orgsPlans } = usePlansList()
const router = useRouter()

const showStudentsPricing = ref(true)

const plan = computed(() => {
	const plans = showStudentsPricing.value ? studentsPlans.value : orgsPlans.value
	return {
		basic: plans.find((plan) => plan.amount === 0),
		plus: plans.find((plan) => plan.amount !== 0),
	}
})
const firstPlan = ref<HTMLDivElement | null>(null)
const height = computed(() => firstPlan.value?.clientHeight || 0)
const dynamicStyle = computed(() => {
	if (!Logic.Common.isLarge) {
		return {
			top: `${(height.value + 40) / 2}px`,
		}
	}
	return {}
})

const choosePlan = (plan: PlanEntity) => {
	const backRoute = '/dashboard'
	if (plan.amount === 0) router.push(backRoute)
	else router.push({ path: `/checkout/subscription/${plan.id}`, query: { back: backRoute } })
}
</script>

<style scoped>
.styled-bg {
	background: url('/images/layer.png'), linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
