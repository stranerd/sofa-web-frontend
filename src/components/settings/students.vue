<template>
  <div class="w-full flex flex-col space-y-5 mdlg:!px-0 px-4">
    <!-- For smaller screens -->
    <div
      v-if="
        Logic.Common.mediaQuery() == 'md' || Logic.Common.mediaQuery() == 'sm'
      "
      class="w-full flex mdlg:hidden flex-col space-y-3 bg-white py-3 px-3 rounded-[8px]"
    >
      <div
        class="flex flex-row items-center space-x-2 opacity-60 cursor-pointer"
        @click="copyJoinLink()"
      >
        <sofa-icon :name="'copy'" :customClass="'h-[14px]'" />
        <sofa-normal-text> Copy join link </sofa-normal-text>
      </div>

      <div class="w-full flex flex-row items-center space-x-3">
        <sofa-button @click="showAddStudents()"> Add student </sofa-button>
        <sofa-button @click="showUpdateJoinCode()">
          Update join code
        </sofa-button>
      </div>
    </div>

    <div
      v-if="allRequests.length"
      class="w-full flex flex-col space-y-4 bg-white mdlg:rounded-[16px] rounded-[8px] py-3 px-3 md:!px-5 md:!py-5 mdlg:px-4 mdlg:py-4 mdlg:shadow-custom"
    >
      <div
        class="w-full flex flex-row items-center justify-between cursor-pointer"
        @click="showRequests ? (showRequests = false) : (showRequests = true)"
      >
        <sofa-header-text :size="'xl'" :customClass="'text-left'">
          Requests ({{ allRequests.length }})
        </sofa-header-text>

        <sofa-icon
          :name="showRequests ? 'chevron-up' : 'chevron-down'"
          :customClass="'h-[7px] cursor-pointer'"
        />
      </div>

      <div class="w-full flex flex-col space-y-4" v-if="showRequests">
        <div
          class="w-full flex flex-row space-x-2 items-center justify-between"
          v-for="(item, index) in allRequests"
          :key="index"
        >
          <div class="flex flex-row space-x-2 items-center">
            <sofa-avatar
              :photoUrl="item.profile_url || ''"
              :size="'23'"
              :bgColor="'bg-grayColor'"
            >
              <sofa-icon :name="'user'" :customClass="'h-[15px]'" />
            </sofa-avatar>

            <sofa-normal-text :customClass="'text-left'">
              {{ item.name }}
            </sofa-normal-text>
          </div>

          <div class="flex flex-row space-x-3 items-center">
            <sofa-normal-text
              :color="'text-primaryRed'"
              :custom-class="'cursor-pointer'"
              @click="
                selectedMember = item.emailId;
                showRemoveMember = true;
              "
            >
              Decline
            </sofa-normal-text>

            <sofa-normal-text
              :color="'text-primaryGreen'"
              :custom-class="'cursor-pointer'"
              @click="
                studentEmails = item.emailId;
                addStudents();
              "
            >
              Accept
            </sofa-normal-text>
          </div>
        </div>
      </div>
    </div>

    <div
      :class="`w-full flex flex-col space-y-4 mdlg:bg-white mdlg:rounded-[16px]  md:!px-5 md:!py-5 mdlg:px-4 mdlg:py-4 mdlg:shadow-custom ${
        allStudents.length > 0 ? 'bg-white rounded-[8px] px-3 py-3' : ''
      }`"
    >
      <div class="w-full flex-row items-center justify-between flex">
        <sofa-header-text :size="'xl'" :customClass="'text-left'">
          Your students
        </sofa-header-text>

        <div class="mdlg:flex flex-row items-center space-x-4 hidden">
          <div
            class="flex flex-row items-center space-x-2 opacity-60 cursor-pointer"
            @click="copyJoinLink()"
          >
            <sofa-normal-text> Copy join link </sofa-normal-text>
            <sofa-icon :name="'copy'" :customClass="'h-[15px]'" />
          </div>

          <div class="flex flex-row items-center space-x-2">
            <sofa-button @click="showAddStudents()"> Add student </sofa-button>
            <sofa-button @click="showUpdateJoinCode()">
              Update join code
            </sofa-button>
          </div>
        </div>
      </div>

      <template v-if="allStudents.length">
        <div class="w-full flex flex-col space-y-4">
          <div
            class="w-full flex flex-row items-center justify-between"
            v-for="(item, index) in allStudents"
            :key="index"
          >
            <div class="flex flex-row items-center space-x-2">
              <sofa-avatar
                :photoUrl="item.profile_url || ''"
                :size="'26'"
                :bgColor="'bg-grayColor'"
              >
                <sofa-icon :name="'user'" :customClass="'h-[15px]'" />
              </sofa-avatar>

              <sofa-normal-text :customClass="'text-left'">
                {{ item.name }}
              </sofa-normal-text>
            </div>

            <div class="flex flex-row space-x-3 items-center">
              <sofa-normal-text
                :color="'text-primaryRed'"
                :customClass="'cursor-pointer'"
                @click="
                  selectedMember = item.emailId;
                  showRemoveMember = true;
                "
              >
                Remove
              </sofa-normal-text>
            </div>
          </div>
        </div>
      </template>
      <sofa-empty-state
        v-else
        :title="'No students'"
        :subTitle="'Your students have free access all contents you create'"
        :actionLabel="'Add students'"
        :action="
          () => {
            showAddStudents();
          }
        "
      />
    </div>

    <div class="h-[40px]"></div>

    <sofa-modal
      v-if="showModal"
      :close="
        () => {
          showModal = false;
        }
      "
    >
      <div
        class="mdlg:!w-[40%] lg:!w-[35%] mdlg:!h-full w-full h-auto md:w-full flex flex-col items-center relative"
        @click.stop="
          () => {
            //
          }
        "
      >
        <div
          class="bg-white w-full flex flex-col lg:!px-6 md:!space-y-5 space-y-3 py-0 relative lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-0 md:!px-0 mdlg:!rounded-[16px] rounded-t-[16px] items-center justify-center"
        >
          <div
            class="w-full hidden flex-col space-y-3 justify-center items-center mdlg:!flex"
          >
            <sofa-header-text :customClass="'text-xl'">
              {{ modalSetup.title }}
            </sofa-header-text>
          </div>

          <div
            class="w-full flex flex-row justify-between items-center sticky top-0 left-0 mdlg:!hidden py-2 border-[#F1F6FA] border-b-[1px] px-4"
          >
            <sofa-normal-text :customClass="'!font-bold !text-base'">
              {{ modalSetup.title }}
            </sofa-normal-text>
            <sofa-icon
              :customClass="'h-[19px]'"
              :name="'circle-close'"
              @click="showModal = false"
            />
          </div>

          <div class="w-full flex flex-col space-y-5 mdlg:!px-0 px-4">
            <sofa-text-field
              v-if="modalSetup.type == 'add_students'"
              :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'px-3 py-3'"
              type="text"
              :name="'Emails field'"
              ref="emails"
              :placeholder="'Student emails (comma-seperated)'"
              :borderColor="'border-transparent'"
              :rules="[Logic.Form.RequiredRule]"
              v-model="studentEmails"
            >
            </sofa-text-field>

            <sofa-text-field
              v-if="modalSetup.type == 'set_Join_code'"
              :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
              :padding="'px-3 py-3'"
              type="password"
              :name="'Join code'"
              ref="join_code"
              :placeholder="'Set Join Code'"
              :borderColor="'border-transparent'"
              :rules="[
                Logic.Form.RequiredRule,
                Logic.Form.customValidator(
                  joinCode.length >= 6,
                  'Join code must be more than 5 characters'
                ),
              ]"
              v-model="joinCode"
            >
            </sofa-text-field>
          </div>

          <div
            class="w-full md:flex flex-row justify-between items-center grid grid-cols-2 md:gap-0 gap-3 mdlg:!px-0 px-4 mdlg:!py-0 py-4"
          >
            <div class="md:!w-auto col-span-1 md:!flex flex-col hidden">
              <sofa-button
                :textColor="'text-grayColor'"
                :bgColor="'bg-white'"
                :padding="'px-4 py-1'"
                :customClass="`border-[2px] border-gray-100 md:!min-w-[100px] md:!w-auto w-full`"
                @click="showModal = false"
              >
                Cancel
              </sofa-button>
            </div>

            <div class="md:!w-auto col-span-2 flex flex-col">
              <sofa-button
                :textColor="'text-white'"
                :bgColor="'bg-primaryBlue'"
                :padding="'px-4 md:!py-1 py-3'"
                :customClass="`border-[2px] border-transparent md:!min-w-[100px] md:!w-auto w-full`"
                @click="modalSetup.action()"
              >
                Continue
              </sofa-button>
            </div>
          </div>
        </div>
      </div>
    </sofa-modal>

    <sofa-delete-prompt
      v-if="showRemoveMember"
      :title="'Are you sure you want to remove this student?'"
      :subTitle="``"
      :close="
        () => {
          showRemoveMember = false;
        }
      "
      :buttons="[
        {
          label: 'No',
          isClose: true,
          action: () => {
            showRemoveMember = false;
          },
        },
        {
          label: 'Yes, remove student',
          isClose: false,
          action: () => {
            removeStudent();
          },
        },
      ]"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import {
  SofaHeaderText,
  SofaIcon,
  SofaNormalText,
  SofaEmptyState,
  SofaAvatar,
  SofaModal,
  SofaTextField,
  SofaButton,
  SofaDeletePrompt,
} from "sofa-ui-components";
import { FormValidations } from "@/composables";
import { Logic } from "sofa-logic";
import {
  allOrganizationMembers,
  setOrganizationMembers,
  allStudents,
  allRequests,
  selectedMember,
  showRemoveMember,
} from "@/composables/profile";

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaIcon,
    SofaNormalText,
    SofaEmptyState,
    SofaAvatar,
    SofaModal,
    SofaTextField,
    SofaButton,
    SofaDeletePrompt,
  },
  setup() {
    const showModal = ref(false);

    const modalSetup = reactive({
      title: "",
      type: "",
      action: () => {
        //
      },
    });
    const studentEmails = ref("");
    const joinCode = ref("");

    const showRequests = ref(false);

    const addStudents = () => {
      if (studentEmails.value) {
        const allEmails = studentEmails.value.split(",").map((item) => {
          return item.trim();
        });

        Logic.Users.AddOrganizationMembers(
          Logic.Auth.AuthUser.id,
          allEmails
        ).then((data) => {
          if (data) {
            Logic.Common.showLoader({
              show: true,
              loading: false,
              message: "Students was added successfully",
              type: "success",
            });
            studentEmails.value = "";
          } else {
            Logic.Common.showLoader({
              show: true,
              loading: false,
              message: "Unable to add students",
              type: "error",
            });
          }

          showModal.value = false;
        });
      }
    };

    const copyJoinLink = async () => {
      Logic.Common.copytext(
        window.location.origin + "/profile/" + Logic.Auth.AuthUser.id
      );
      Logic.Common.showLoader({
        show: true,
        loading: false,
        message: "Join link copied!",
        type: "success",
      });
    };

    const showAddStudents = () => {
      modalSetup.title = "Add students";
      modalSetup.type = "add_students";
      modalSetup.action = () => {
        addStudents();
      };
      showModal.value = true;
    };

    const showUpdateJoinCode = () => {
      modalSetup.title = "Update join code";
      modalSetup.type = "set_Join_code";
      modalSetup.action = () => {
        if (joinCode.value) {
          Logic.Users.UpdateOrganizationCode(joinCode.value)
            .then((data) => {
              if (data) {
                Logic.Common.showLoader({
                  show: true,
                  loading: false,
                  message: "Join link updated!",
                  type: "success",
                });
              }
              showModal.value = false;
            })
            .catch(() => {
              Logic.Common.showLoader({
                show: true,
                loading: false,
                message: `Unable to update join link. Join code must contain at least 1 alphabet`,
                type: "error",
              });
            });
        }
      };
      showModal.value = true;
    };

    const removeStudent = () => {
      Logic.Users.RemoveOrganizationMember(
        Logic.Auth.AuthUser.id,
        selectedMember.value
      ).then((response) => {
        if (response) {
          Logic.Common.showLoader({
            show: true,
            loading: false,
            message: "Student removed from your organisation!",
            type: "success",
          });
        } else {
          Logic.Common.showLoader({
            show: true,
            loading: false,
            message: "Unable to remove student. Please try again",
            type: "error",
          });
        }

        showRemoveMember.value = false;
      });
    };

    onMounted(() => {
      if (allOrganizationMembers.value == undefined) {
        Logic.Users.GetOrganizationMembers(Logic.Auth.AuthUser.id).then(() => {
          Logic.Common.hideLoader();

          setOrganizationMembers();
        });
      } else {
        setOrganizationMembers();
      }
      Logic.Users.watchProperty(
        "AllOrganisationMembers",
        allOrganizationMembers
      );
    });

    watch(allOrganizationMembers, () => {
      setOrganizationMembers();
    });

    return {
      FormValidations,
      allStudents,
      allRequests,
      showRequests,
      Logic,
      allOrganizationMembers,
      showModal,
      studentEmails,
      joinCode,
      modalSetup,
      showRemoveMember,
      selectedMember,
      addStudents,
      copyJoinLink,
      showAddStudents,
      showUpdateJoinCode,
      removeStudent,
    };
  },
});
</script>
