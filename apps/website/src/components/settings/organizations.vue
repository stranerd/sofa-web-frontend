<template>
  <div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
    <div :class="`w-full flex flex-col gap-4 mdlg:bg-white mdlg:rounded-[16px]  md:!px-5 md:!py-5 mdlg:px-4 mdlg:py-4 mdlg:shadow-custom ${allOrganizations.length > 0 ? 'bg-white rounded-[8px] px-3 py-3' : ''
      }`">
      <div class="w-full flex-row items-center justify-between md:flex hidden" v-if="Logic.Common.mediaQuery() != 'md' && Logic.Common.mediaQuery() != 'sm'
        ">
        <sofa-header-text :size="'xl'" :customClass="'text-left'">
          Organizations
        </sofa-header-text>
      </div>

      <template v-if="allOrganizations.length">
        <div class="w-full flex flex-col gap-4">
          <div class="w-full flex flex-row gap-2 items-center justify-between" v-for="(item, index) in allOrganizations"
            :key="index">
            <div class="flex flex-row items-center gap-2">
              <sofa-avatar :photoUrl="item.profile_url || ''" :size="'23'" :bgColor="'bg-grayColor'">
                <sofa-icon :name="'user'" :customClass="'h-[15px]'" />
              </sofa-avatar>

              <sofa-normal-text :customClass="'text-left'">
                {{ item.name }}
              </sofa-normal-text>
            </div>
            <div class="flex flex-row">
              <sofa-normal-text :color="'text-primaryRed'" :custom-class="'cursor-pointer'" @click="
                selectedOrganization = item.id
              showLeaveOrganization = true;
              ">
                Leave
              </sofa-normal-text>
            </div>
          </div>
        </div>
      </template>
      <sofa-empty-state v-else :title="'No organization'" :subTitle="'Your are not a student of any organization'" />
    </div>

    <div class="h-[40px]"></div>

    <sofa-delete-prompt v-if="showLeaveOrganization" :title="'Are you sure you want to leave this organization?'"
      :subTitle="`This action is permanent. You will lose access to all current and future resources of this organization.`"
      :close="() => {
        showLeaveOrganization = false
      }
        " :buttons="[
    {
      label: 'No',
      isClose: true,
      action: () => {
        showLeaveOrganization = false
      },
    },
    {
      label: 'Yes, leave',
      isClose: false,
      action: () => {
        leaveOrganization()
      },
    },
  ]" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue"
import {
  SofaHeaderText,
  SofaIcon,
  SofaNormalText,
  SofaEmptyState,
  SofaAvatar,
  SofaDeletePrompt,
} from "sofa-ui-components"
import { FormValidations } from "@/composables"
import { Logic } from "sofa-logic"
import { setOrganizations, allOrganizations } from "@/composables/profile"

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaIcon,
    SofaNormalText,
    SofaEmptyState,
    SofaAvatar,
    SofaDeletePrompt,
  },
  setup () {
    const UserProfile = ref(Logic.Users.UserProfile)

    const selectedOrganization = ref("")
    const showLeaveOrganization = ref(false)

    onMounted(async () => {
      await setOrganizations()
      Logic.Users.watchProperty("UserProfile", UserProfile)
    })

    watch(UserProfile, async () => {
      await setOrganizations()
    })

    const leaveOrganization = () => {
      Logic.Users.LeaveOrganization(selectedOrganization.value).then((data) => {
        if (data) {
          Logic.Common.showLoader({
            show: true,
            loading: false,
            message: "You have been removed from this organization.",
            type: "success",
          })
          showLeaveOrganization.value = false
        } else {
          Logic.Common.showLoader({
            show: true,
            loading: false,
            message: "Unable to leave request. Please try again.",
            type: "error",
          })
        }
      })
    }

    return {
      FormValidations,
      Logic,
      allOrganizations,
      selectedOrganization,
      showLeaveOrganization,
      leaveOrganization,
    }
  },
})
</script>
