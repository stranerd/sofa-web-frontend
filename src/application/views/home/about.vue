<template>
	<main class="w-full flex flex-col gap-20 bg-white max-w-[1800px] mx-auto">
		<header class="flex flex-col items-center justify-center">
			<HomeNavbar />
			<div class="styled-bg w-full h-[400px] py-6 md:h-[800px] flex flex-col items-center justify-center">
				<div class="w-[90%] md:w-[80%] mx-auto h-full flex flex-col items-center justify-center gap-4 md:gap-12">
					<h1 class="text-[20px] md:text-[40px] text-white text-center font-bold">About Us</h1>
					<img class="mdlg:h-[533px]" src="/images/about-hero-image.png" />
				</div>
			</div>
		</header>
		<!-- About us -->
		<div class="w-[90%] md:w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative">
			<div class="w-full order-2 md:order-1 md:w-3/5 flex flex-col gap-1">
				<h2 class="text-[24px] font-bold about-us-button md:text-left text-center">About Us</h2>
				<p class="text-[16px]">
					At Stranerd, we are on a mission to revolutionize the way learning centers operate and deliver education. Founded in
					2019, we recognized the need for a comprehensive learning infrastructure that empowers educators, engages learners, and
					streamlines administrative tasks. With a team of passionate individuals driven by innovation and a dedication to
					improving education, we've developed a cutting-edge platform that addresses these challenges head-on.
				</p>
			</div>
			<div class="w-[80%] order-1 md:order-2 md:w-2/5 flex items-center justify-center">
				<img src="/images/about-us.png" class="object-contain" />
			</div>
			<img class="hidden mdlg:block absolute -bottom-10 left-[50%] right-0" src="/images/about-us-vector.png" />
		</div>
		<!-- Our Vision -->
		<div class="w-[90%] md:w-[80%] mx-auto flex md:flex-row flex-col items-center justify-between gap-12">
			<div class="w-[80%] md:w-2/5 flex items-center justify-center">
				<img src="/images/our-vision.png" class="object-contain" />
			</div>
			<div class="w-full md:w-3/5 flex flex-col gap-1">
				<h2 class="text-[24px] font-bold about-us-button md:text-left text-center">Our Vision</h2>
				<p class="text-[16px] md:w-[80%]">
					Our vision is to create a world where every learner has access to personalized and impactful education, and every
					educator has the tools they need to inspire and empower their students.
				</p>
			</div>
		</div>
		<!-- Our Mission -->
		<div class="w-[90%] md:w-[80%] mx-auto flex md:flex-row flex-col items-center justify-between gap-12 relative">
			<div class="w-full md:w-3/5 order-2 md:order-1">
				<div class="md:pl-[100px] flex flex-col gap-1">
					<h2 class="text-[24px] font-bold about-us-button md:text-left text-center">Our Mission</h2>
					<p class="text-[16px] w-full md:w-[80%]">
						We are committed to providing learning centers with the most advanced and intuitive infrastructure, enabling them to
						deliver high-quality education efficiently and effectively.
					</p>
				</div>
			</div>
			<div class="w-[80%] md:w-2/5 order-1 md:order-2 flex items-center justify-center">
				<img src="/images/our-mission.png" class="object-contain" />
			</div>
			<img class="hidden md:block absolute -bottom-6 left-0" src="/images/our-mission-vector-2.png" />
			<img class="hidden md:block absolute -top-16 right-0" src="/images/our-mission-vector-1.png" />
		</div>
		<!-- What sets us apart -->
		<div
			class="styled-bg w-[90%] md:w-[80%] min-h-[600px] mdlg:h-[600px] mx-auto rounded-[20px] flex flex-col mdlg:flex-row items-center justify-between gap-6 px-8 py-20 mdlg:px-0 mdlg:py-0">
			<div class="mdlg:pl-10 w-full mdlg:w-1/2 order-2 mdlg:order-1 flex flex-col gap-2 justify-center">
				<h3 class="text-white font-bold text-[20px] md:text-[36px] md:leading-[54px]">What Sets Us Apart</h3>
				<ul class="text-white list-disc text-[15px] pl-6">
					<li>
						Innovation: We are at the forefront of technological advancements in education, constantly evolving our platform to
						meet the changing needs of learners and educators.
					</li>
					<li>
						User-Centric Design: Our platform is designed with the user in mind, ensuring a seamless experience for both
						educators and learners.
					</li>
					<li>
						Collaborative Approach: We believe in the power of collaboration and actively seek feedback from our users to
						continuously improve our platform.
					</li>
				</ul>
			</div>
			<div class="w-full mdlg:w-1/2 order-1 mdlg:order-2 flex items-center justify-center">
				<img src="/images/what-set-us-apart.png" />
			</div>
		</div>
		<!-- Our Values -->
		<div class="w-[90%] md:w-[80%] mx-auto flex flex-col mdlg:flex-row items-center gap-6 mdlg:gap-20">
			<img src="/images/our-values.png" />
			<div class="flex flex-col gap-2">
				<h3 class="text-[24px] font-bold">Our Values</h3>
				<ul class="list-disc pl-4 text-[16px]">
					<li><b>Excellence:</b> We strive for excellence in everything we do, from product development to customer support.</li>
					<li><b>Integrity:</b> We operate with integrity, honesty, and transparency in all our interactions.</li>
					<li>
						<b>Empowerment:</b> We empower educators to unlock the full potential of their students and create meaningful
						learning experiences.
					</li>
				</ul>
			</div>
		</div>
		<HomeJoinUs class="w-[90%] md:w-[80%] mx-auto" />
		<HomeFooter />
	</main>
</template>

<style scoped>
.styled-bg {
	background: url('/images/layer.png'), linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
