<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCheckout } from "../../store/checkout.store.ts";
import { useSettings } from "../../store/settings.store.ts";
import {computed} from "vue";
import {ICheckoutStatus} from "../../types/checkout.ts";

const checkoutStore = useCheckout();
const { isPaid, checkout } = storeToRefs(checkoutStore);

const settingsStore = useSettings();
const { messages } = storeToRefs(settingsStore);

const reCreateCheckout = () => {
  checkoutStore.reCreate();
};

const statusText = computed(() => {
  if (isPaid.value) {
    if (!messages.value) return;
    if (checkout.value?.orderId) {
      return messages.value.paidStatusText?.replace('{orderId}', checkout.value.orderId)
    }
    if (checkout.value.status === ICheckoutStatus.PROCESS) return 'Еще чуть-чуть'

    return messages.value.errorStatusText;
  } else {
    return messages.value?.expiredStatusText;
  }
})

const descriptionText = computed(() => {
  if (isPaid.value) {
    if (!messages.value) return;
    if (checkout.value?.orderId) {
      return messages.value.paidDescriptionText?.replace('{orderId}', checkout.value.orderId)
    }
    if (checkout.value.status === ICheckoutStatus.PROCESS) return 'Ваш заказ в процессе формирования, пожалуйста, подождите'
    return messages.value.errorDescriptionText;
  } else {
    return messages.value?.expiredDescriptionText;
  }
})
</script>

<template>
  <div
    class="t-min-h-[40vh] t-items-center t-justify-center t-flex t-flex-1 t-flex-col t-w-full"
  >
    <div class="t-mt-auto t-flex t-flex-col t-pb-10 lg:t-pb-16 t-items-center">
      <svg
        v-if="isPaid"
        class="t-mb-10 lg:t-mb-16 lg:t-w-[15rem] lg:t-h-[15rem]"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="60" cy="60" r="60" fill="#EDECE3" fill-opacity="0.4" />
        <path
          d="M45.1191 64.32L54.7191 73.92L78.7191 49.92"
          stroke="#111827"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        v-else
        class="t-mb-10 lg:t-mb-16 lg:t-w-[15rem] lg:t-h-[15rem]"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="60" cy="60" r="60" fill="#EDECE3" fill-opacity="0.4" />
        <path
          d="M74.5043 45.7044L45.7043 74.5044"
          stroke="#111827"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M45.7043 45.7044L74.5043 74.5044"
          stroke="#111827"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <div
        class="t-text-[28px] lg:t-text-[48px] t-text-black t-mb-4 lg:t-mb-5"
        v-if="messages"
      >
        {{statusText}}
      </div>
      <div class="t-text-base lg:t-text-[20px] t-text-black">
        {{descriptionText}}
      </div>
    </div>
    <div class="t-flex t-justify-center t-w-full t-mt-auto t-gap-4">
      <a href="/">На главную</a>
      <button type="button" @click="reCreateCheckout">
        Попробовать заново
      </button>
      <a href="/cart">В корзину</a>
    </div>
  </div>
</template>

<style scoped></style>
