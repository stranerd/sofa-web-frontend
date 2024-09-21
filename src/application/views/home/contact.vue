<template>
	<main class="w-full flex flex-col bg-white mx-auto">
		<header class="flex flex-col items-center justify-center">
			<HomeNavbar />
			<div class="styled-bg h-[1000px] min-h-[800px] mdlg:h-[800px] w-full flex items-center justify-center">
				<div
					class="w-[90%] max-w-[1800px] mx-auto flex justify-between relative mt-[230px] sm:mt-[200px] mdlg:mt-0 mdlg:flex-row flex-col gap-10 mdlg:gap-0">
					<div class="w-full mdlg:w-1/2 flex flex-col gap-4 mdlg:pr-16 text-center md:text-left">
						<div class="flex flex-col gap-2.5">
							<h1 class="text-[20px] mdlg:text-[40px] text-white leading-[30px] mdlg:leading-[60px] font-normal">
								<span class="bg-white text-purple font-bold rounded-[16px] p-[10px]">Get in touch</span> with us to
							</h1>
							<h1 class="text-[20px] mdlg:text-[40px] text-white leading-[30px] mdlg:leading-[60px] font-normal">
								discover the amazing world of learning
							</h1>
						</div>
						<p class="text-white text-[14px] md:text-[16px]">
							Lorem ipsum dolor sit amet consectetur. In aenean habitant malesuada congue varius sed mi convallis
							pellentesque. Etiam et ac quam ut. Et dictumst dolor enim ornare scelerisque neque lectus lorem. Enim venenatis
							morbi a sed vivamus viverra.
						</p>
						<div class="flex flex-col gap-4">
							<div class="flex flex-col md:flex-row items-center gap-6">
								<img src="/images/landing/mail.png" />
								<p class="text-white">{{ CONTACT_EMAIL }}</p>
							</div>
							<div class="flex flex-col md:flex-row items-center gap-6">
								<img src="/images/landing/phone.png" />
								<p class="text-white">{{ CONTACT_NUMBER }}</p>
							</div>
						</div>
					</div>
					<div class="mdlg:absolute mdlg:right-0 w-full mdlg:w-1/2 flex justify-center relative" style="z-index: 999">
						<div class="bg-white rounded-[30px] w-full md:w-[90%] mx-auto py-10" style="box-shadow: 0 4px 16px 0 #00000066">
							<p class="text-black text-[20px] md:text-[36px] font-bold text-center">Contact Us Today</p>
							<form class="flex flex-col w-[90%] md:w-[80%] mx-auto gap-6 pt-8" @submit.prevent="sendMessage">
								<!-- Full name -->
								<div class="flex flex-col gap-2">
									<label class="flex items-center gap-3">
										<SofaIcon name="user" class="!fill-[#686969]" />
										<p class="text-[#686969] capitalize text-[14px] md:text-[16px]">Full Name</p>
									</label>
									<input
										v-model="factory.name"
										class="border border-[#5A5A5A] h-[50px] rounded-lg p-4 placeholder:text-[#D9D9D9] text-[14px] md:text-[16px]"
										placeholder="Enter your full name here"
										required />
								</div>
								<!-- Email Address -->
								<div class="flex flex-col gap-2">
									<label class="flex items-center gap-3">
										<SofaIcon name="email-social" class="!fill-[#686969]" />
										<p class="text-[#686969] capitalize text-[14px] md:text-[16px]">Email Address</p>
									</label>
									<input
										v-model="factory.email"
										type="email"
										class="border border-[#5A5A5A] h-[50px] rounded-lg p-4 placeholder:text-[#D9D9D9] text-[14px] md:text-[16px]"
										placeholder="Enter Your Email Address Here"
										required />
								</div>
								<!-- Phone Number -->
								<div v-if="0" class="flex flex-col gap-2">
									<label class="flex items-center gap-3">
										<SofaIcon name="phone" class="!fill-[#686969]" />
										<p class="text-[#686969] capitalize text-[14px] md:text-[16px]">Phone Number</p>
									</label>
									<div class="border flex items-center border-[#5A5A5A] h-[50px] rounded-lg text-[14px] md:text-[16px]">
										<input
											v-model="factory.phone.code"
											type="tel"
											:min="1"
											:max="4"
											placeholder="Country code"
											class="w-1/5 p-2 md:p-4 !h-full outline-none border-r border-[#5A5A5A]" />
										<input
											v-model="factory.phone.number"
											type="tel"
											:min="7"
											placeholder="Enter Your Phone Number Here"
											class="w-3/5 p-2 md:p-4 !h-full outline-none border-none placeholder:text-[#D9D9D9]"
											required />
									</div>
								</div>
								<!-- Message -->
								<div class="flex flex-col gap-2">
									<label class="flex items-center gap-3">
										<SofaIcon name="edit" class="!fill-[#686969]" />
										<p class="text-[#686969] capitalize text-[14px] md:text-[16px]">Message</p>
									</label>
									<textarea
										id=""
										v-model="factory.message"
										name=""
										cols="30"
										rows="10"
										class="border border-[#5A5A5A] h-[80px] mdlg:h-[187px] rounded-lg text-[14px] md:text-[16px] p-4 placeholder:text-[#D9D9D9]"
										required
										placeholder="Enter Your Message Here"></textarea>
								</div>
								<button
									type="submit"
									class="bg-purple text-white text-[14px] md:text-[16px] h-[45px] md:h-[55px] w-full rounded-lg">
									Submit
								</button>
							</form>
							<img
								class="absolute -top-[30px] -right-0 md:w-[100px] md:h-[130px] mdlg:-top-[50px] mdlg:-right-[20px] w-[59px] h-[75px] mdlg:w-[145px] mdlg:h-[177px]"
								src="/images/landing/stranerd-rob.png" />
						</div>
					</div>
				</div>
			</div>
		</header>
		<section class="bg-[#FFD233] py-20 flex flex-col items-center justify-center mdlg:items-start relative">
			<img
				class="mdlg:absolute mdlg:-top-[120px] mdlg:w-[384px] mdlg:h-[466px] pt-[250px] md:pt-[200px] mdlg:pt-0"
				src="/images/landing/stranerd-rob.png" />
			<HomeJoinUs class="w-[90%] md:w-[80%] mx-auto mt-[100px] mdlg:mt-[360px]" :isContactPage="true" />
		</section>
		<HomeFooter />
	</main>
</template>

<script setup>
import { useMetaMessage } from '@app/composables/users/metaMessage'

const { CONTACT_EMAIL, CONTACT_NUMBER } = $utils.constants
const { sendMessage, factory } = useMetaMessage()
</script>

<style scoped>
.styled-bg {
	background: url('/images/landing/layer.png'), linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
