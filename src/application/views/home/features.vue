<template>
	<main class="w-full bg-white max-w-[1800px] mx-auto">
		<header class="flex flex-col items-center justify-center">
			<HomeNavbar />
			<div class="hero w-full h-[800px] flex flex-col items-center justify-center">
				<div class="w-[80%] mx-auto h-full flex flex-col items-center justify-center gap-12">
					<h1 class="text-[40px] text-white text-center font-bold">Features</h1>
					<img class="h-[533px]" src="/images/features-hero-image.png" />
				</div>
			</div>
		</header>
	</main>
</template>

<style scoped>
.hero {
	background: url('/images/layer.png'), linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
