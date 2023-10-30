<template>
  <div :class="`flex w-full flex-col space-y-2 ${customClass}`">
    <div
      @click="selected ? (selected = false) : (selected = true)"
      class="flex w-full flex-row space-x-2 items-center cursor-pointer"
    >
      <span :class="`${iconWidth}`">
        <sofa-icon
          :name="`${selected ? 'checkbox-active' : 'checkbox'}`"
          :customClass="`md:!h-[18px] h-[20px]`"
        />
      </span>
      <div
        class="flex flex-row space-x-2 items-center lg:text-sm mdlg:text-[12px] text-xs"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch } from "vue";
import SofaIcon from "../SofaIcon/index.vue";

export default defineComponent({
  props: {
    extraData: {
      type: Object as () => any,
      default: () => ({}),
    },
    defaultValue: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: "",
    },
    iconWidth: {
      type: String,
      default: "w-[25px]",
    },
  },
  components: {
    SofaIcon,
  },
  name: "SofaCheckbox",
  emits: ["update:modelValue", "onSelected"],
  setup(prop, context) {
    const selected = ref(false);

    watch(selected, () => {
      context.emit("update:modelValue", selected.value);
      context.emit("onSelected", prop.extraData);
    });

    const defaultValueRef = toRef(prop, "defaultValue");

    watch(defaultValueRef, () => {
      selected.value = defaultValueRef.value;
    });

    onMounted(() => {
      selected.value = prop.defaultValue;
    });

    return {
      selected,
    };
  },
});
</script>
