<template>
	<div class="w-full h-full flex fixed top-0 left-0 bg-white items-center justify-center">
		<div class="bg-white w-full lg:w-[45%] mdlg:w-[50%] h-full flex flex-col items-center justify-center">
			<div class="w-full h-full flex-grow flex flex-col justify-start relative md:p-8 p-4">
				<div class="w-full flex gap-4 items-center">
					<a @click="Logic.Common.goBack()">
						<sofa-icon :custom-class="'md:h-[26px] h-[20px] cursor-pointer'" :name="'back-arrow'" />
					</a>

					<div class="w-full flex flex-col md:justify-center md:items-center justify-start items-start gap-1">
						<sofa-header-text :custom-class="'md:!text-2xl text-lg'" :content="title" />
						<sofa-normal-text v-if="subTitle" :color="'text-grayColor'" :custom-class="'!font-normal'" :content="subTitle" />
					</div>
				</div>

				<div class="h-full flex flex-col items-center gap-4 justify-center w-full md:px-10 px-0">
					<slot />
				</div>
			</div>
		</div>

		<sofa-image-loader
			:photo-url="'/images/auth-bg.png'"
			:custom-class="`bg-primaryPurple hidden mdlg:flex flex-col relative lg:w-[55%] mdlg:w-[50%] h-full items-center justify-center pt-9`">
			<div class="w-full h-full bg-deepGray bg-opacity-75 top-0 left-0 absolute flex flex-col gap-5 px-[14%] py-6 justify-center">
				<div class="w-full bg-white rounded-custom px-5 py-3">
					<sofa-normal-text :custom-class="'!font-bold !text-base gap-2 flex'">
						<span> Did you know? </span>
						<sofa-icon :name="'idea'" :custom-class="'h-[20px]'" />
					</sofa-normal-text>
				</div>
				<sofa-normal-text :color="'text-white'" :custom-class="'text-left !text-2xl'">
					The human brain can store about 2.5 petabytes of information? That's roughly equivalent to three million hours of TV
					shows.
				</sofa-normal-text>
			</div>
		</sofa-image-loader>
	</div>
</template>

<script lang="ts">
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaIcon, SofaImageLoader, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AuthLayout',
	components: {
		SofaHeaderText,
		SofaImageLoader,
		SofaNormalText,
		SofaIcon,
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		subTitle: {
			type: String,
			required: false,
			default: '',
		},
	},
	setup() {
		return { Logic }
	},
})
</script>
