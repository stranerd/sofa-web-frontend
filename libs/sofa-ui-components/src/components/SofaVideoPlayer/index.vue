<template>
  <div :class="`${customClass} relative`">
    <video
      ref="videoPlayer"
      class="video-js w-full md:!h-[440px] h-[400px] relative !rounded-[12px]"
    ></video>

    <div
      v-if="!videoIsPlaying"
      class="flex flex-row items-center justify-center !rounded-[12px] absolute h-full w-full top-0 left-0 bg-black bg-opacity-60"
    >
      <sofa-icon
        name="play-video"
        :customClass="`${iconSize} cursor-pointer`"
        @click="playVideo()"
      />
    </div>
  </div>
</template>
<script lang="ts">
import SofaIcon from "../SofaIcon/index.vue";
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import videojs from "video.js/dist/video.es.js";
import "video.js/dist/video-js.min.css";
export default defineComponent({
  components: {
    SofaIcon,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    },
    iconSize: {
      type: String,
      default: "h-[18px]",
    },
  },
  name: "SofaVideoPlayer",
  setup(props: any) {
    let player = ref<videojs.Player>();
    const videoPlayer = ref();
    const videoIsPlaying = ref(false);
    const options = {
      autoplay: false,
      controls: true,
      sources: [
        {
          src: props.videoUrl,
          type: "video/mp4",
        },
      ],
    };
    const playVideo = () => {
      player.value?.play();
      videoIsPlaying.value = true;
    };
    watch(props, () => {
      options.sources[0].src = props.videoUrl;
      player.value?.src(props.videoUrl);
      playVideo();
    });
    onMounted(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment

      player.value = videojs(videoPlayer.value, options, () => {
        //
      });
    });
    onUnmounted(() => {
      player.value?.dispose();
    });
    return {
      videoPlayer,
      videoIsPlaying,
      playVideo,
    };
  },
});
</script>
<style>
.video-js div iframe {
  border-radius: 12px;
}
.video-js div {
  border-radius: 12px;
}
</style>
