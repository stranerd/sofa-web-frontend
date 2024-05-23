<template>
	<main class="w-full flex flex-col gap-20 bg-white mx-auto">
		<header class="flex flex-col items-center justify-center">
			<HomeNavbar />
			<div class="styled-bg w-full h-[400px] py-6 md:h-[800px] flex flex-col items-center justify-center">
				<div class="w-[90%] md:w-[80%] mx-auto h-full flex flex-col items-center justify-center gap-4 md:gap-12">
					<h1 class="text-[20px] md:text-[40px] text-white text-center font-bold">About Us</h1>
					<img class="mdlg:h-[533px]" src="/images/landing/about-hero-image.png" />
				</div>
			</div>
		</header>
		<!-- About us -->
		<div class="w-[90%] md:w-[80%] max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative">
			<div class="w-full order-2 md:order-1 md:w-3/5 flex flex-col gap-1">
				<div class="relative">
					<div
						class="absolute md:left-0 md:translate-x-0 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#E6CDFF] w-[54px] h-[33px]"></div>
					<h2 class="relative text-[24px] font-bold about-us-button md:text-left text-center z-0">About Us</h2>
				</div>
				<p class="text-[16px] text-center md:text-left">
					At Stranerd, we are on a mission to revolutionize the way learning centers operate and deliver education. Founded in
					2019, we recognized the need for a comprehensive learning infrastructure that empowers educators, engages learners, and
					streamlines administrative tasks. With a team of passionate individuals driven by innovation and a dedication to
					improving education, we've developed a cutting-edge platform that addresses these challenges head-on.
				</p>
			</div>
			<div class="w-[80%] order-1 md:order-2 md:w-2/5 flex items-center justify-center">
				<img src="/images/landing/about-us.png" class="object-contain" />
			</div>
			<img class="hidden mdlg:block absolute -bottom-10 left-[50%] right-0" src="/images/landing/about-us-vector.png" />
		</div>
		<!-- Our Vision -->
		<div class="w-[90%] md:w-[80%] max-w-[1800px] mx-auto flex md:flex-row flex-col items-center justify-between gap-12">
			<div class="w-[80%] md:w-2/5 flex items-center justify-center">
				<img src="/images/landing/our-vision.png" class="object-contain" />
			</div>
			<div class="w-full md:w-3/5 flex flex-col gap-1 relative">
				<div class="relative">
					<div
						class="absolute md:left-0 md:translate-x-0 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#E6CDFF] w-[54px] h-[33px]"></div>
					<h2 class="relative text-[24px] font-bold about-us-button md:text-left text-center z-0">Our Vision</h2>
				</div>
				<p class="text-[16px] md:w-[80%] text-center md:text-left">
					Our vision is to create a world where every learner has access to personalized and impactful education, and every
					educator has the tools they need to inspire and empower their students.
				</p>
			</div>
		</div>
		<!-- Our Mission -->
		<div class="w-[90%] md:w-[80%] max-w-[1800px] mx-auto flex md:flex-row flex-col items-center justify-between gap-12 relative">
			<div class="w-full md:w-3/5 order-2 md:order-1">
				<div class="md:pl-[100px] flex flex-col gap-1">
					<div class="relative">
						<div
							class="absolute md:left-0 md:translate-x-0 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#E6CDFF] w-[54px] h-[33px]"></div>
						<h2 class="relative text-[24px] font-bold about-us-button md:text-left text-center z-0">Our Mission</h2>
					</div>
					<p class="text-[16px] w-full md:w-[80%] text-center md:text-left">
						We are committed to providing learning centers with the most advanced and intuitive infrastructure, enabling them to
						deliver high-quality education efficiently and effectively.
					</p>
				</div>
			</div>
			<div class="w-[80%] md:w-2/5 order-1 md:order-2 flex items-center justify-center">
				<img src="/images/landing/our-mission.png" class="object-contain" />
			</div>
			<img class="hidden md:block absolute -bottom-6 left-0" src="/images/landing/our-mission-vector-2.png" />
			<img class="hidden md:block absolute -top-16 right-0" src="/images/landing/our-mission-vector-1.png" />
		</div>
		<!-- What we believe -->
		<div class="flex justify-center mdlg:p-6 w-full">
			<div class="flex flex-col items-center justify-center md:w-[80%] p-12 gap-12 w-full">
				<div
					class="flex flex-col items-center justify-center w-full md:w-3/5 lg:w-[400px] h-[400px] shadow-xl rounded-2xl p-4 gap-1 max-w-full">
					<img src="/images/landing/about-excellence.png" alt="About Excellence" class="w-[120px]" />
					<h3 class="font-bold text-[20px] md:text-[20px] md:leading-[54px] uppercase">Excellence</h3>
					<p class="text-center text-[15px]">
						We are a result oriented, efficient, and dedicated team committed to delivering outstanding results.
					</p>
				</div>
				<div class="flex flex-col md:flex-row w-full justify-center items-center md:items-start md:gap-12">
					<div class="flex flex-col items-center justify-center w-full md:w-3/5 lg:w-[400px] h-[400px] shadow-xl rounded-2xl p-4">
						<img src="/images/landing/about-collaboration.png" alt="About Excellence" class="w-[120px]" />
						<h3 class="font-bold text-[20px] md:text-[20px] md:leading-[54px] uppercase">Collaboration</h3>
						<p class="text-center text-[15px] md:text-left">
							We strongly believe in “working interdependently” as one of the most powerful ways of achieving remarkable
							results. We emphasize a strong team spirit, adaptability, effective listening, and inclusiveness as essential
							traits for a successful collaboration.
						</p>
					</div>
					<div class="flex flex-col items-center justify-center w-full md:w-3/5 lg:w-[400px] h-[400px] shadow-xl rounded-2xl p-4">
						<img src="/images/landing/about-high-standard.png" alt="About Excellence" class="w-[120px]" />
						<h3 class="font-bold text-[20px] md:text-[20px] md:leading-[54px] uppercase">High-Standard</h3>
						<p class="text-center text-[15px]">
							At Stranerd, we insist on accuracy, correctness and meticulous attention to detail in everything we do. Our work
							involves clear communication and a proactive approach to consistently achieve the highest quality and precision.
						</p>
					</div>
				</div>
				<div
					class="flex flex-col items-center justify-center w-full h-auto md:w-[400px] h-[400px] mdlg:w-[1000px] lg:h-[600px] shadow-xl rounded-2xl p-6 gap-1 max-w-full">
					<img src="/images/landing/about-creativity.png" alt="About Excellence" class="w-[120px]" />
					<h3 class="font-bold text-[20px] md:text-[20px] md:leading-[54px] uppercase">Creativity</h3>
					<p class="text-center text-[15px]">
						Creativity drives our innovative problem-solving approach. At stranerd, we encourage foresight, a solution-oriented
						mindset, fluidity and flexibility in our respective teams. We are certain that when we envision possibilities, craft
						practical solutions, foster a dynamic environment and adapt to new challenges, we can unleash our collective
						creativity to tackle any task towards the accomplishment of our goals.
					</p>
				</div>
			</div>
		</div>
		<HomeJoinUs class="w-[90%] md:w-[80%] mx-auto" />
		<HomeFooter />
	</main>
</template>

<style scoped>
.styled-bg {
	background: url('/images/landing/landing/layer.png'),
		linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
