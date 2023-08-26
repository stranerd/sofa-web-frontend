<template>
  <div class="w-full flex flex-col space-y-5 mdlg:!px-0 px-4">
    <div
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
    >
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Wallet
      </sofa-header-text>

      <div class="w-full flex flex-col space-y-1">
        <div class="flex flex-row items-center space-x-2">
          <sofa-normal-text>Balance</sofa-normal-text>
          <sofa-icon
            :customClass="`${
              showMoney ? 'h-[10px]' : 'h-[15px]'
            } cursor-pointer`"
            :name="showMoney ? 'hide' : 'show'"
            @click="showMoney ? (showMoney = false) : (showMoney = true)"
          />
        </div>

        <div class="w-full flex flex-col items-left">
          <sofa-header-text :customClass="'text-left mdlg:!text-3xl !text-2xl'">
            {{
              showMoney
                ? Logic.Common.convertToMoney(
                    UserWallet.balance.amount,
                    true,
                    "ngn"
                  )
                : "****"
            }}
          </sofa-header-text>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-3 pt-4">
          <div
            @click="showFundWallet()"
            class="col-span-1 flex flex-row items-center py-3 px-3 space-x-2 cursor-pointer custom-border justify-center border-[2px] border-[#E1E6EB]"
          >
            <sofa-icon :customClass="'h-[16px]'" :name="'fund-wallet'" />
            <sofa-normal-text :customClass="'text-grayColor'"
              >Fund wallet</sofa-normal-text
            >
          </div>

          <div
            @click="showWalletWithdraw()"
            class="col-span-1 flex flex-row items-center py-3 px-3 space-x-2 custom-border cursor-pointer justify-center border-[2px] border-[#E1E6EB]"
          >
            <sofa-icon :customClass="'h-[16px]'" :name="'withdraw-wallet'" />
            <sofa-normal-text :customClass="'text-grayColor'"
              >Withdraw</sofa-normal-text
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom pb-7"
    >
      <sofa-header-text :size="'xl'" :customClass="'text-left'">
        Payment method
      </sofa-header-text>

      <div
        class="w-full flex flex-row items-center space-x-3 px-3 py-3 cursor-pointer"
        @click="Logic.Payment.initialPayment()"
      >
        <sofa-icon :customClass="'h-[18px]'" :name="'add-card'" />
        <sofa-normal-text :color="'text-grayColor'"
          >Add credit or debit card</sofa-normal-text
        >
      </div>

      <div
        :class="`w-full flex flex-row items-center space-x-3 px-3 py-3 border-[2px] ${
          selectedMethodId == method.id
            ? 'border-primaryBlue'
            : 'border-[#E1E6EB]'
        }  custom-border cursor-pointer `"
        v-for="(method, index) in PaymentMethods.results"
        :key="index"
      >
        <sofa-icon :customClass="'h-[20px]'" :name="'card'" />
        <sofa-normal-text>
          **** **** **** {{ method.data.last4Digits }}
        </sofa-normal-text>
      </div>
    </div>

    <div
      class="w-full flex flex-col space-y-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom"
    >
      <div
        class="w-full flex flex-row items-center justify-between border-b-[1px] border-[#F1F6FA] pb-2"
      >
        <sofa-header-text :size="'xl'" :customClass="'text-left'">
          Transaction history
        </sofa-header-text>

        <sofa-icon :customClass="'h-[20px]'" :name="'calendar'" />
      </div>

      <div class="w-full flex flex-col space-y-2" v-if="transactions.length">
        <div
          v-for="(transaction, index) in transactions"
          :key="index"
          :class="`w-full flex flex-col space-y-1 pb-2 cursor-pointer  ${
            index != transactions.length - 1
              ? 'border-b-[1px] border-[#F1F6FA]'
              : ''
          }`"
          @click="showTransactionInfo(transaction.data)"
        >
          <div class="w-full flex flex-row items-center justify-between">
            <sofa-normal-text :customClass="'text-left'">
              {{ transaction.title }}
            </sofa-normal-text>
            <sofa-normal-text
              :customClass="'!font-bold'"
              :color="`${
                transaction.type == 'credit'
                  ? `${
                      transaction.status == 'failed'
                        ? '!text-primaryRed'
                        : '!text-primaryGreen'
                    }`
                  : '!text-bodyBlack'
              }`"
            >
              {{ transaction.type == "credit" ? "+" : "" }}
              {{ Logic.Common.convertToMoney(transaction.amount, true, "ngn") }}
            </sofa-normal-text>
          </div>
          <div
            class="w-full flex flex-row justify-start space-x-2 items-center"
          >
            <sofa-normal-text :color="'text-grayColor'">
              {{ transaction.date }}
            </sofa-normal-text>
            <span class="h-[4px] w-[4px] bg-grayColor rounded-full"> </span>
            <sofa-normal-text :color="'text-grayColor'">
              {{ transaction.time }}
            </sofa-normal-text>
          </div>
        </div>
      </div>

      <sofa-empty-state
        v-else
        :title="'No transaction yet'"
        :subTitle="'All you wallet transaction would show up here'"
      />
    </div>

    <div class="h-[40px]"></div>
  </div>
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
          v-if="
            modalContent == 'fund_wallet' || modalContent == 'withdraw_money'
          "
        >
          <sofa-header-text :customClass="'text-xl'">
            {{ modalTitle }}
          </sofa-header-text>
        </div>
        <div
          class="w-full hidden flex-row justify-between items-center mdlg:!flex"
          v-if="modalContent == 'transaction_info'"
        >
          <sofa-header-text :customClass="'text-xl'">
            {{ modalTitle }}
          </sofa-header-text>
          <sofa-icon
            :customClass="'h-[20px] cursor-pointer'"
            :name="'circle-close'"
            @click="showModal = false"
          />
        </div>

        <div
          class="w-full flex flex-row justify-between items-center sticky top-0 left-0 mdlg:!hidden py-2 border-[#F1F6FA] border-b-[1px] px-4"
        >
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            {{ modalTitle }}
          </sofa-normal-text>
          <sofa-icon
            :customClass="'h-[19px]'"
            :name="'circle-close'"
            @click="showModal = false"
          />
        </div>

        <div
          class="w-full flex flex-col space-y-5 mdlg:!px-0 px-4"
          v-if="modalContent == 'fund_wallet'"
        >
          <sofa-text-field
            :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'px-3 py-3'"
            type="text"
            :name="'Amount'"
            ref="amount"
            :placeholder="'Amount'"
            :borderColor="'border-transparent'"
            :rules="[Logic.Form.RequiredRule]"
            :isFormatted="true"
            v-model="fundWalletAmount"
          >
            <template v-slot:inner-prefix>
              <sofa-normal-text>₦</sofa-normal-text>
            </template>
          </sofa-text-field>

          <div
            class="w-full flex flex-col space-y-2 border-t-[1px] border-[#F1F6FA] pt-3"
          >
            <div
              :class="`w-full flex flex-row items-center space-x-3 px-3 py-3  bg-[#F1F6FA] ${
                fundWalletMethod == 'online'
                  ? 'border-primaryBlue  border-[2px]'
                  : ''
              }  custom-border cursor-pointer `"
              @click="fundWalletMethod = 'online'"
            >
              <sofa-icon :customClass="'h-[20px]'" :name="'website'" />
              <sofa-normal-text> Pay online </sofa-normal-text>
            </div>

            <div
              :class="`w-full flex flex-row items-center space-x-3 px-3 py-3 bg-[#F1F6FA]  ${
                fundWalletMethod == method.id
                  ? 'border-primaryBlue border-[2px]'
                  : ''
              }  custom-border cursor-pointer `"
              @click="
                fundWalletMethod
                  ? (fundWalletMethod = '')
                  : (fundWalletMethod = method.id)
              "
              v-for="(method, index) in PaymentMethods.results"
              :key="index"
            >
              <sofa-icon :customClass="'h-[20px]'" :name="'card'" />
              <sofa-normal-text>
                **** **** **** {{ method.data.last4Digits }}
              </sofa-normal-text>
            </div>

            <div
              class="w-full flex flex-row items-center space-x-3 px-3 py-3 cursor-pointer border-[2px] custom-border border-[#E1E6EB]"
              @click="Logic.Payment.initialPayment()"
            >
              <sofa-icon :customClass="'h-[18px]'" :name="'add-card'" />
              <sofa-normal-text :color="'text-grayColor'"
                >Add credit or debit card</sofa-normal-text
              >
            </div>
          </div>
        </div>

        <div
          class="w-full flex flex-col space-y-3 mdlg:!px-0 px-4"
          v-if="modalContent == 'transaction_info'"
        >
          <div
            class="w-full flex flex-col px-4 py-4 justify-start border-[2px] border-[#E1E6EB] custom-border"
          >
            <sofa-normal-text>
              {{ transactionTitle }}
            </sofa-normal-text>
            <sofa-header-text
              :customClass="'text-left mdlg:!text-3xl !text-2xl'"
            >
              {{
                Logic.Common.convertToMoney(
                  transactionDetails.amount,
                  true,
                  "ngn"
                )
              }}
            </sofa-header-text>
          </div>

          <div class="w-full flex flex-col space-y-4 pt-3 md:!pb-0 pb-4">
            <div
              v-for="(item, index) in transactionDetails"
              :key="index"
              class="w-full flex flex-row items-center justify-between"
            >
              <sofa-normal-text :color="'text-grayColor'">
                {{ capitalize(index.split("_").join(" ")) }}
              </sofa-normal-text>
              <sofa-normal-text
                :customClass="'!font-semibold'"
                :color="'text-[#141618]'"
              >
                {{ item }}
              </sofa-normal-text>
            </div>
          </div>
        </div>

        <div
          class="w-full flex flex-col space-y-3 mdlg:!px-0 px-4"
          v-if="modalContent == 'withdraw_money'"
        >
          <sofa-text-field
            :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'px-3 py-3'"
            type="text"
            :name="'Amount'"
            ref="amount"
            :placeholder="'Amount'"
            :borderColor="'border-transparent'"
            :rules="[Logic.Form.RequiredRule]"
            :isFormatted="true"
            v-model="withdrawForm.amount"
          >
            <template v-slot:inner-prefix>
              <sofa-normal-text>₦</sofa-normal-text>
            </template>
          </sofa-text-field>

          <sofa-text-field
            :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'px-3 py-3'"
            type="tel"
            :name="'Account number'"
            ref="account_number"
            :placeholder="'Account number'"
            :borderColor="'border-transparent'"
            :rules="[Logic.Form.RequiredRule]"
            v-model="withdrawForm.account_number"
          >
          </sofa-text-field>

          <sofa-select
            :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '"
            :padding="'px-3 py-3'"
            :name="'Bank'"
            ref="bank"
            :placeholder="'Bank'"
            :borderColor="'border-transparent'"
            :rules="[Logic.Form.RequiredRule]"
            :options="commercialBankOptions"
            :auto-complete="true"
            v-model="withdrawForm.bank"
          >
          </sofa-select>
        </div>

        <div
          class="w-full md:flex flex-row justify-between items-center grid grid-cols-2 md:gap-0 gap-3 mdlg:!px-0 px-4 mdlg:!py-0 py-4"
          v-if="modalContent != 'transaction_info'"
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
              @click="handleContinue()"
            >
              Continue
            </sofa-button>
          </div>
        </div>
      </div>
    </div>
  </sofa-modal>
</template>
<script lang="ts">
import {
  capitalize,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import {
  SofaHeaderText,
  SofaIcon,
  SofaNormalText,
  SofaEmptyState,
  SofaModal,
  SofaTextField,
  SofaButton,
  SofaSelect,
} from "sofa-ui-components";
import { FormValidations } from "@/composables";
import { Logic } from "sofa-logic";
import { Transaction } from "sofa-logic/src/logic/types/domains/payment";
import { SelectOption } from "sofa-logic/src/logic/types/common";
import moment from "moment";

export default defineComponent({
  components: {
    SofaHeaderText,
    SofaIcon,
    SofaNormalText,
    SofaEmptyState,
    SofaModal,
    SofaTextField,
    SofaButton,
    SofaSelect,
  },
  setup() {
    const UserWallet = ref(Logic.Payment.UserWallet);
    const AllTransactions = ref(Logic.Payment.AllTransactions);
    const PaymentMethods = ref(Logic.Payment.PaymentMethods);
    const AllCommercialBanks = ref(Logic.Payment.AllCommercialBanks);

    const fundWalletAmount = ref("");
    const selectedMethodId = ref("");
    const fundWalletMethod = ref("");

    const showModal = ref(false);
    const modalTitle = ref("");
    const modalContent = ref("");
    const transactionTitle = ref("Withdrawal");

    const showMoney = ref(true);

    const commercialBankOptions = ref<SelectOption[]>([]);

    const withdrawForm = reactive({
      amount: "",
      account_number: "",
      bank: "",
    });

    const transactionDetails = reactive({
      amount: "₦10,000",
      transaction_fee: "₦500",
      bank: "GTBank",
      account_name: "James Roland",
      account_number: "0125647439",
      date: "Mar 31, 2023",
      time: "8:22 AM",
    });

    const transactions = ref([]);

    const setTransactions = () => {
      transactions.value.length = 0;
      AllTransactions.value.results.forEach((transaction) => {
        transactions.value.push({
          title: transaction.title,
          type: transaction.amount > 0 ? "credit" : "debit",
          date: `${Logic.Common.fomartDate(transaction.createdAt, "MMM D")}`,
          time: `${Logic.Common.fomartDate(transaction.createdAt, "hh:mma")}`,
          amount: transaction.amount,
          data: transaction,
          status: transaction.status,
          fullData: transaction.createdAt,
        });
      });

      transactions.value.sort(
        (a, b) => moment(b.fullData).valueOf() - moment(a.fullData).valueOf()
      );
    };

    const setCommercialBankOptions = () => {
      commercialBankOptions.value.length = 0;
      AllCommercialBanks.value.forEach((bank) => {
        commercialBankOptions.value.push({
          key: bank.code,
          value: bank.name,
        });
      });
    };

    const showFundWallet = () => {
      modalTitle.value = "Fund wallet";
      modalContent.value = "fund_wallet";
      showModal.value = true;
    };

    const showWalletWithdraw = () => {
      modalTitle.value = "Withdraw money";
      modalContent.value = "withdraw_money";
      showModal.value = true;
    };

    const showTransactionInfo = (transaction: Transaction) => {
      let transactionType = "Withdrawal";

      if (transaction.title.includes("Test charge")) {
        transactionType = "Wallet funding";
      }

      if (
        transaction.title.includes("Purchasing") ||
        transaction.title.includes("Purchase")
      ) {
        transactionType = "Course purchase";
      }

      if (transaction.title.includes("Withdrawal")) {
        transactionType = "Withdrawal";
      }

      transactionTitle.value = transactionType;
      transactionDetails.transaction_fee = "₦0";
      transactionDetails.amount = Logic.Common.convertToMoney(
        transaction.amount,
        false,
        "ngn"
      );
      transactionDetails.date = `${Logic.Common.fomartDate(
        transaction.createdAt,
        "MMM D, YYYY"
      )}`;
      transactionDetails.time = `${Logic.Common.fomartDate(
        transaction.createdAt,
        "hh:mma"
      )}`;

      modalTitle.value = "Transaction details";
      modalContent.value = "transaction_info";
      showModal.value = true;
    };

    const handleContinue = () => {
      if (modalContent.value == "fund_wallet" && fundWalletAmount.value) {
        const amount = parseFloat(fundWalletAmount.value.replace(/,/g, ""));
        if (fundWalletMethod.value) {
          Logic.Payment.FundWalletForm = {
            amount,
            methodId: fundWalletMethod.value,
          };
          Logic.Payment.FundWallet().then((data) => {
            if (data) {
              Logic.Common.showLoader({
                show: true,
                loading: false,
                message: "Funding successful",
                type: "success",
              });
            } else {
              Logic.Common.showLoader({
                show: true,
                loading: false,
                message: "Funding failed",
                type: "error",
              });
            }

            showModal.value = false;
            fundWalletAmount.value = "0";
            fundWalletMethod.value = "";
          });
        } else {
          Logic.Payment.initialPayment(amount);
        }
      } else if (modalContent.value == "withdraw_money") {
        if (
          withdrawForm.account_number &&
          withdrawForm.amount &&
          withdrawForm.bank
        ) {
          const amount = parseFloat(withdrawForm.amount.replace(/,/g, ""));

          Logic.Payment.UpdateAccountForm = {
            bankCode: withdrawForm.bank,
            bankNumber: withdrawForm.account_number,
            country: "NG",
          };

          Logic.Payment.UpdateAccountNumber().then((data) => {
            if (data) {
              Logic.Payment.WithdrawFromWallet(amount).then((data) => {
                if (data) {
                  Logic.Common.showLoader({
                    show: true,
                    loading: false,
                    message: "Withdrawal successful",
                    type: "success",
                  });

                  showModal.value = false;
                  withdrawForm.account_number = "";
                  withdrawForm.amount = "";
                  withdrawForm.bank = "";
                } else {
                  Logic.Common.showLoader({
                    show: true,
                    loading: false,
                    message: "Withdrawal failed",
                    type: "error",
                  });
                }

                showModal.value = false;
                fundWalletAmount.value = "0";
                fundWalletMethod.value = "";
              });
            }
          });
        }
      }
    };
    onMounted(() => {
      Logic.Payment.watchProperty("UserWallet", UserWallet);
      Logic.Payment.watchProperty("AllTransactions", AllTransactions);
      Logic.Payment.watchProperty("PaymentMethods", PaymentMethods);
      setTransactions();
      setCommercialBankOptions();
    });

    watch(AllTransactions, () => {
      setTransactions();
    });

    return {
      FormValidations,
      Logic,
      transactions,
      UserWallet,
      AllTransactions,
      showModal,
      modalTitle,
      modalContent,
      PaymentMethods,
      selectedMethodId,
      fundWalletAmount,
      transactionDetails,
      transactionTitle,
      withdrawForm,
      fundWalletMethod,
      commercialBankOptions,
      showMoney,
      showFundWallet,
      handleContinue,
      showTransactionInfo,
      capitalize,
      showWalletWithdraw,
    };
  },
});
</script>
