<template>
  <iframe
    class="w-full flex flex-col h-full flex-grow outline-none border-[1px] border-[#F1F6FA] rounded-[8px]"
    :src="`/web/viewer.html?file=${documentUrl}`"
  >
  </iframe>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  components: {},
  props: {
    customClass: {
      type: String,
      default: "",
    },
    documentUrl: {
      type: String,
      default:
        "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    },
  },
  name: "SofaDocumentReader",
  setup() {
    onMounted(() => {});
  },
});
</script>
