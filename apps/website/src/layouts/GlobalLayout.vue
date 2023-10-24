<template>
  <template v-if="!Logic.Common.isNativeApp">
    <slot />
  </template>
  <ion-page v-else>
    <ion-content :scroll-y="false">
      <slot />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Logic } from "sofa-logic";
import { IonContent, IonPage } from "@ionic/vue";

export default defineComponent({
  components: {
    IonContent,
    IonPage,
  },
  props: {},
  name: "GlobalLayout",
  setup() {
    return {
      Logic,
    };
  },
});
</script>
