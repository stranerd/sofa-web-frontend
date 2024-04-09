<template>
	<div class="bg-white flex flex-col gap-2">
		<div class="flex gap-3 items-start">
			<SofaAvatar photoUrl="/images/sam.png" :size="Logic.Common.isLarge ? 48 : 24" />
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<SofaNormalText customClass="font-bold">
						{{ 'Ekeme' }}
					</SofaNormalText>
					<div class="h-[5px] w-[5px] bg-grayColor rounded-full"></div>
					<SofaNormalText color="text-grayColor">{{ '30mins' }}</SofaNormalText>
				</div>
				<SofaNormalText color="text-deepGray">{{ 'Why do you think it I ask this question? ' }} </SofaNormalText>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Logic } from 'sofa-logic'
</script>
