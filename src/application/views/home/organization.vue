<template>
	<main>
		<header class="flex gap-[44px] flex-col items-center justify-center">
			<HomeNavbar />
			<!-- Link -->
			<div
				class="flex items-center bg-white h-[44px] rounded-[22px] w-[268px] overflow-hidden"
				style="box-shadow: 0px 4px 16px 0px #00000040">
				<router-link to="/home/students" class="w-1/2 h-full flex items-center justify-center p-5 rounded-[22px]">
					Students
				</router-link>
				<router-link
					to="/home/organization"
					class="w-1/2 h-full flex items-center justify-center p-5 bg-purple text-white rounded-[22px]">
					Organizations
				</router-link>
			</div>
		</header>
	</main>
</template>

<script setup lang="ts"></script>
