<template>
  <component :is="as"
    :class="`px-3 py-1 lg:text-sm mdlg:text-[12px] text-xs ${customClass} text-xs rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px]
	${
    color == 'purple'
      ? ` bg-primaryPurple ${
          isInverted ? 'text-primaryPurple bg-opacity-25' : ' text-white '
        } `
      : ''
  }
	${
    color == 'green'
      ? `  bg-primaryGreen ${
          isInverted ? 'text-primaryGreen bg-opacity-25' : ' text-white '
        }`
      : ''
  }
	${
    color == 'blue'
      ? `  bg-primaryBlue ${
          isInverted ? 'text-primaryBlue bg-opacity-25' : ' text-white '
        }`
      : ''
  }
	${
    color == 'orange'
      ? `  bg-primaryOrange ${
          isInverted ? 'text-primaryOrange bg-opacity-25' : ' text-white '
        }`
      : ''
  }
  ${
    color == 'gray'
      ? `  bg-backgroundGray ${
          isInverted ? 'text-bodyBlack bg-opacity-50' : ' text-grayColor '
        }`
      : ''
  }
	${
    color == 'pink'
      ? ` bg-primaryPink ${
          isInverted ? 'text-primaryPink bg-opacity-25' : ' text-white '
        }`
      : ''
  }
	`"
  >
    <slot />
  </component>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    color: {
      type: String,
      default: "purple",
    },
    customClass: {
      type: String,
      default: "",
    },
    isInverted: {
      type: Boolean,
      default: false,
    },
    as: {
      type: String,
      required: false,
      default: 'span'
    }
  },
  name: "SofaBadge",
});
</script>
