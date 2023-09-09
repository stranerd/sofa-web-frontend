<template>
  <sofa-text-field
    v-for="(item, index) in allLinks"
    :key="index"
    :placeholder="capitalize(item.ref)"
    :name="'Website'"
    ref="socials.website"
    :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
    :rules="[FormValidations.UrlRule]"
    v-model="item.link"
    :update-value="item.link"
  >
    <template v-slot:inner-prefix>
      <sofa-icon
        :name="item.icon"
        :customClass="`${item.iconSize} cursor-pointer `"
      />
    </template>
  </sofa-text-field>

  <div class="w-full flex flex-col space-y-3 pt-2">
    <div
      class="w-full flex flex-row items-center justify-start space-x-3 py-3 px-3 custom-border border-[2px] border-[#E1E6EB] cursor-pointer"
      @click="
        showAddNewItems ? (showAddNewItems = false) : (showAddNewItems = true)
      "
    >
      <sofa-icon :name="'box-plus'" :customClass="'h-[20px]'" />
      <sofa-normal-text :color="'text-[#78828C]'"> Add link </sofa-normal-text>
    </div>

    <div class="w-full flex flex-col space-y-2" v-if="showAddNewItems">
      <div
        class="w-full flex flex-row items-center justify-start space-x-3 py-3 px-3 custom-border border-[2px] border-[#E1E6EB] cursor-pointer"
        @click="addNewLink(item.ref)"
        v-for="(item, index) in profileLinks"
        :key="index"
      >
        <sofa-icon
          :name="item.icon"
          :customClass="`${item.iconSize} cursor-pointer `"
        />
        <sofa-normal-text :color="'text-[#78828C]'">
          {{ capitalize(item.ref) }}
        </sofa-normal-text>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { capitalize, defineComponent, onMounted, ref, watch } from "vue";
import { SofaTextField, SofaNormalText, SofaIcon } from "sofa-ui-components";
import { FormValidations } from "@/composables";
import { profileLinks, allLinks, addNewLink } from "@/composables/profile";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaTextField,
    SofaNormalText,
    SofaIcon,
  },
  setup() {
    const showAddNewItems = ref(false);

    onMounted(() => {
      allLinks.length = 0;
      const userSocials = Logic.Users.UserProfile.socials;
      userSocials.forEach((item) => {
        const currentLinkInfo = profileLinks.filter(
          (eachItem) => eachItem.ref == item.ref
        );

        allLinks.push({
          icon: currentLinkInfo[0]?.icon || "",
          iconSize: currentLinkInfo[0]?.iconSize || "",
          link: item.link,
          ref: item.ref,
          show: true,
        });
      });
    });

    watch(allLinks, () => {
      Logic.Common.debounce(() => {
        Logic.Users.UpdateUserSocialForm = {
          socials: allLinks
            .filter((item) => item.link)
            .map((item) => {
              return {
                ref: item.ref,
                link: item.link,
              };
            }),
        };
        Logic.Users.UpdateUserSocial();
      }, 500);
    });

    return {
      FormValidations,
      showAddNewItems,
      profileLinks,
      allLinks,
      addNewLink,
      capitalize,
    };
  },
});
</script>
