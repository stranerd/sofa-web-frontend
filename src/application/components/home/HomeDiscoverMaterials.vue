<template>
	<div class="bg-[#D6EBFFCC] w-[90%] mx-auto rounded-[30px] p-10 mdlg:p-24 mb-20 max-w-[1800px]">
		<div class="flex flex-col gap-6">
			<div class="grid grid-cols-1 mdlg:grid-cols-2 gap-6 mdlg:gap-0">
				<div class="order-2 mdlg:order-1 flex flex-col gap-6">
					<div class="flex items-center gap-6">
						<div class="bg-[#3219AF] w-[50%] h-[150px] md:h-[350px] rounded-[20px] flex items-center justify-center">
							<p class="text-center text-white text-[14px] md:text-[24px] mdlg:text-[36px] font-bold">Chemistry</p>
						</div>
						<div class="bg-[#FCA311] w-[40%] h-[150px] md:h-[350px] rounded-[20px] flex items-center justify-center">
							<p class="text-center text-white text-[14px] md:text-[24px] mdlg:text-[36px] font-bold">Biology</p>
						</div>
					</div>
				</div>
				<div class="order-1 mdlg:order-2 flex flex-col gap-6">
					<div class="flex flex-col gap-5">
						<div class="flex flex-col gap-1">
							<h4 class="text-[20px] md:text-[36px] font-bold md:leading-[54px]">
								Discover Study Materials By Verified Creators
							</h4>
							<p class="text-[14px] md:text-[16px] leading-[24px]">
								Explore a Treasure Trove of Learning Resources Curated by Accredited Experts. Dive into a World of Engaging
								Content Crafted to Elevate Your Education Journey. Immerse Yourself in Rich, Insightful Materials Designed
								to Fuel Your Curiosity and Drive Success. Unlock the Power of Knowledge with Confidence, Knowing Each
								Resource Comes from Trusted Sources. Your Path to Excellence Starts Here.
							</p>
						</div>
						<RouterLink
							to="/marketplace"
							class="self-start bg-purple text-[14px] md:text-[16px] text-white py-[16px] px-[32px] rounded-[99px]">
							Discover creators
						</RouterLink>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-1 mdlg:grid-cols-2 gap-6 mdlg:gap-0">
				<div class="flex items-center gap-6">
					<div class="bg-[#E52237] w-[40%] h-[150px] md:h-[350px] rounded-[20px] flex items-center justify-center">
						<p class="text-center text-white text-[14px] md:text-[24px] mdlg:text-[36px] font-bold">Physics</p>
					</div>
					<div class="bg-[#4ECB71] w-[50%] h-[150px] md:h-[350px] rounded-[20px] flex items-center justify-center">
						<p class="text-center text-white text-[14px] md:text-[24px] mdlg:text-[36px] font-bold">Government</p>
					</div>
				</div>
				<div class="flex items-center justify-center">
					<img src="/images/landing/video-placeholder.png" />
				</div>
			</div>
		</div>
	</div>
</template>
