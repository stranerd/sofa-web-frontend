<template>
  <form id="form-wrapper">
    <slot />
  </form>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  components: {},
  props: {
    parentRefs: {
      required: false,
    },
  },
  name: "RoofFormWrapper",
  setup(props: any) {
    const formWrapper = ref<any>(null);

    const fieldsToValidate = ref<any[]>();

    watch(props, () => {
      if (props.parentRefs) fieldsToValidate.value = props.parentRefs;
    });

    const validate = () => {
      let formIsValid = true;
      for (const key in fieldsToValidate.value) {
        const componentName: any = key;
        const element = fieldsToValidate.value[componentName];
        if (element) {
          if ("checkValidation" in element) {
            element.checkValidation();
            formIsValid = formIsValid && element.validationStatus;
          }

          if (element[0]) {
            if ("checkValidation" in element[0]) {
              element[0].checkValidation();
              formIsValid = formIsValid && element[0].validationStatus;
            }
          }
        }
      }
      return formIsValid;
    };

    return {
      formWrapper,
      validate,
      fieldsToValidate,
    };
  },
});
</script>
