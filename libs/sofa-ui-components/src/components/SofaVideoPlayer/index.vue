<template>
	<VideoPlayer src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" :controls="true"
		:loop="true" :volume="0.6" :autoplay="false" @play="videoIsPlaying = true" @pause="videoIsPlaying = false"
		@ended="videoIsPlaying = false" class="w-full min-h-[400px]">
		<template v-if="!videoIsPlaying" v-slot="{ player }">
			<div class="flex items-center justify-center absolute h-full w-full top-0 left-0 bg-black bg-opacity-60">
				<SofaIcon name="play-video" class="h-[18px]" @click="player.play()" />
			</div>
		</template>
	</VideoPlayer>
</template>

<script lang="ts">
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.min.css'
import { defineComponent, ref } from 'vue'
import SofaIcon from '../SofaIcon'
export default defineComponent({
	components: {
		SofaIcon, VideoPlayer
	},
	props: {
		videoUrl: {
			type: String,
			default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
		},
	},
	name: 'SofaVideoPlayer',
	setup () {
		const videoIsPlaying = ref(false)
		return { videoIsPlaying }
	},
})
</script>

<style>
.video-js div iframe {
	border-radius: 12px;
}

.video-js div {
	border-radius: 12px;
}
</style>
