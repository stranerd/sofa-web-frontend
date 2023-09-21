<template>
  <div
    :class="`col-span-1 flex flex-col space-y-2 px-3 py-3 cursor-pointer custom-border ${customClass}`"
  >
    <sofa-image-loader
      custom-class="w-full mdlg:!h-[155px] h-[120px] custom-border relative"
      :photo-url="content.image"
    >
      <div
        class="flex flex-row space-x-2 items-center justify-end absolute bottom-0 left-0 w-full px-2 py-2"
        v-if="content.price > 0"
      >
        <sofa-badge
          :customClass="'!bg-[#141618] !bg-opacity-50 !text-white !px-4 !py-2 custom-border'"
        >
          {{
            content.price > 0
              ? `${Logic.Common.convertToMoney(content.price, false, "ngn")}`
              : "Start"
          }}
        </sofa-badge>
      </div>
    </sofa-image-loader>
    <sofa-normal-text
      :customClass="'!font-bold w-full flex pt-1 justify-start text-left !line-clamp-1'"
    >
      {{ content.title }}
    </sofa-normal-text>
    <div class="flex flex-row space-x-2 items-center">
      <sofa-normal-text
        :color="
          content.labels.color == 'pink'
            ? 'text-primaryPurplePink'
            : 'text-primaryPurple'
        "
      >
        {{ content.labels.main }}
      </sofa-normal-text>
      <span
        :class="`h-[5px] w-[5px] rounded-full ${
          content.labels.color == 'pink'
            ? 'bg-primaryPurplePink'
            : 'bg-primaryPurple'
        }`"
      >
      </span>
      <sofa-normal-text
        :color="
          content.labels.color == 'pink'
            ? 'text-primaryPurplePink'
            : 'text-primaryPurple'
        "
        >{{ content.labels.sub }}</sofa-normal-text
      >
    </div>

    <div class="w-full flex flex-row space-x-2 items-center">
      <sofa-icon :name="'star-full'" :custom-class="'h-[16px]'" />

      <div class="flex flex-row space-x-1 items-center">
        <sofa-normal-text> {{ content.ratings.avg }} </sofa-normal-text>
        <sofa-normal-text :color="'text-grayColor'">
          ({{ content.ratings.count }} ratings)
        </sofa-normal-text>
      </div>
    </div>

    <div
      class="flex flex-row space-x-2 items-center justify-between pt-1"
      v-if="content.user"
    >
      <router-link :to="`/profile/${content.user.id}`" class="space-x-2 flex flex-row items-center cursor-pointer">
        <sofa-avatar
          :size="'20'"
          :photoUrl="content.user.bio.photo?.link ?? ''"
          :bgColor="'bg-grayColor'"
          :user-id="content.user.id"
        >
          <sofa-icon
            :customClass="'h-[12px]'"
            :name="'user'"
            v-if="!content.user.bio.photo?.link"
          />
        </sofa-avatar>
        <sofa-normal-text
          :customClass="'!whitespace-nowrap !line-clamp-1'"
        >
          {{ content.authUserId === content.user.id ? 'You' : content.user.bio.name.full }}
        </sofa-normal-text>
        <sofa-icon v-if="content.user.roles.isVerified" :name="'verify'" :custom-class="'h-[13px]'" />
        <sofa-icon v-if="content.user.type?.type === 'teacher'" :name="'tutor-bagde'" :custom-class="'h-[13px]'" />
      </router-link>

      <sofa-icon
        @click.stop="bookmarkAction ? bookmarkAction() : null"
        :name="'bookmark'"
        :customClass="'h-[18px] '"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SofaIcon from "../SofaIcon";
import SofaImageLoader from "../SofaImageLoader";
import { SofaNormalText } from "../SofaTypography";
import SofaBadge from "../SofaBadge";
import SofaButton from "../SofaButton";
import { Logic } from "../../composable";
import SofaAvatar from "../SofaAvatar";

export default defineComponent({
  components: {
    SofaIcon,
    SofaImageLoader,
    SofaNormalText,
    SofaBadge,
    SofaButton,
    SofaAvatar,
  },
  props: {
    customClass: {
      type: String,
      default: "border-[2px] rounded-[16px] border-[#E1E6EB]",
    },
    content: {
      type: Object as () => any,
    },
    bookmarkAction: {
      type: Function,
    },
  },
  name: "SofaItemCard",
  setup() {
    return {
      Logic,
    };
  },
});
</script>
