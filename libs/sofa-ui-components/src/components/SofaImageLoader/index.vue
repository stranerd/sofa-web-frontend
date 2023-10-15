<template>
  <div
    id=""
    :class="`${customClass} blend-in `"
    :style="`
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center; ${
      imageUrl || loadDirectly
        ? `background-image:url(${loadDirectly ? photoUrl : imageUrl});`
        : ''
    }  ${customStyle}`"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, toRef, watch } from "vue";

export default defineComponent({
  name: "SofaImageLoader",
  props: {
    photoUrl: {
      type: String,
      required: true,
    },
    customClass: {
      type: String,
      default: "",
    },
    customStyle: {
      type: String,
      default: "",
    },
    loadDirectly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const image = ref("");
    const imageUrl = ref("");

    const setImage = () => {
      imageUrl.value = props.photoUrl || "";

      const highResImage = new Image();

      highResImage.onload = function () {
        image.value = imageUrl.value;
      };

      highResImage.src = imageUrl.value;
    };

    onMounted(() => {
      if (!props.loadDirectly) {
        setImage();
      }
    });

    const photoUrlRef = toRef(props, "photoUrl");

    watch(photoUrlRef, () => {
      if (!props.loadDirectly) {
        setImage();
      }
    });

    return {
      image,
      imageUrl,
    };
  },
});
</script>
<!-- <style scoped>
  .blend-in {
	animation: fadein 0.15s;
	-moz-animation: fadein 0.15s; /* Firefox */
	-webkit-animation: fadein 0.15s; /* Safari and Chrome */
	-o-animation: fadein 0.15s; /* Opera */
  }
  </style> -->
