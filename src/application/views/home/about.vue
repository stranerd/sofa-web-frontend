<template>
	<main class="w-full flex flex-col gap-20 bg-white max-w-[1800px] mx-auto">
		<header class="flex flex-col items-center justify-center">
			<HomeNavbar />
			<div class="styled-bg w-full h-[800px] flex flex-col items-center justify-center">
				<div class="w-[80%] mx-auto h-full flex flex-col items-center justify-center gap-12">
					<h1 class="text-[40px] text-white text-center font-bold">About Us</h1>
					<img class="h-[533px]" src="/images/about-hero-image.png" />
				</div>
			</div>
		</header>
		<!-- About us -->
		<div class="w-[80%] mx-auto flex items-center justify-between gap-12 relative">
			<div class="w-3/5 flex flex-col gap-1">
				<h2 class="text-[24px] font-bold about-us-button">About Us</h2>
				<p class="text-[16px]">
					At Stranerd, we are on a mission to revolutionize the way learning centers operate and deliver education. Founded in
					2019, we recognized the need for a comprehensive learning infrastructure that empowers educators, engages learners, and
					streamlines administrative tasks. With a team of passionate individuals driven by innovation and a dedication to
					improving education, we've developed a cutting-edge platform that addresses these challenges head-on.
				</p>
			</div>
			<div class="w-2/5 flex items-center justify-center">
				<img src="/images/about-us.png" />
			</div>
			<img class="absolute -bottom-10 left-[50%] right-0" src="/images/about-us-vector.png" />
		</div>
		<!-- Our Vision -->
		<div class="w-[80%] mx-auto flex items-center justify-between gap-12">
			<div class="w-2/5 flex items-center justify-center">
				<img src="/images/our-vision.png" />
			</div>
			<div class="w-3/5 flex flex-col gap-1">
				<h2 class="text-[24px] font-bold about-us-button">Our Vision</h2>
				<p class="text-[16px] w-[80%]">
					Our vision is to create a world where every learner has access to personalized and impactful education, and every
					educator has the tools they need to inspire and empower their students.
				</p>
			</div>
		</div>
		<!-- Our Mission -->
		<div class="w-[80%] mx-auto flex items-center justify-between gap-12 relative">
			<div class="w-3/5">
				<div class="pl-[100px] flex flex-col gap-1">
					<h2 class="text-[24px] font-bold about-us-button">Our Mission</h2>
					<p class="text-[16px] w-[80%]">
						We are committed to providing learning centers with the most advanced and intuitive infrastructure, enabling them to
						deliver high-quality education efficiently and effectively.
					</p>
				</div>
			</div>
			<div class="w-2/5 flex items-center justify-center">
				<img src="/images/our-mission.png" />
			</div>
			<img class="absolute -bottom-6 left-0" src="/images/our-mission-vector-2.png" />
			<img class="absolute -top-16 right-0" src="/images/our-mission-vector-1.png" />
		</div>
		<!-- What sets us apart -->
		<div class="styled-bg w-[80%] h-[600px] mx-auto rounded-[20px] flex flex-col mdlg:flex-row items-center justify-between">
			<div class="pl-10 w-1/2 flex flex-col gap-2 justify-center">
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
			<div class="w-1/2 flex items-center justify-center">
				<img src="/images/what-set-us-apart.png" />
			</div>
		</div>
		<!-- Our Values -->
		<div class="w-[80%] mx-auto flex items-center gap-20">
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
		<HomeJoinUs class="w-[80%] mx-auto" />
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
