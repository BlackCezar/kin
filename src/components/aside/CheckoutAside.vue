<script setup lang="ts">
import UiInput from "../ui/UiInput.vue";
import * as yup from "yup";
import { useForm } from "vee-validate";
import CheckoutAsideProductLine from "./CheckoutAsideProductLine.vue";
import { useCheckout } from "../../store/checkout.store.ts";
import { storeToRefs } from "pinia";
import CheckoutAsideTotals from "./CheckoutAsideTotals.vue";

const checkoutStore = useCheckout();
const { cart, isLoading } = storeToRefs(checkoutStore);
const {} = useForm({
  validationSchema: yup.object().shape({
    promoCode: yup.string().optional().min(4),
  }),
  initialValues: {
    promoCode: "",
  },
});
</script>

<template>
  <aside class="t-max-w-[544px] t-w-full t-min-w-[352px]">
    <div class="t-mb-9">
      <h2 class="t-h2 t-pl-5 lg:t-pl-7 t-mb-5">Детали заказа</h2>
      <UiInput label="Промокод" name="promoCode" />
    </div>
    <div
      class="t-grid t-grid-cols-[88px_auto] lg:t-grid-cols-[132px_auto] t-gap-6 t-mb-12"
    >
      <template v-for="item of cart?.items" :key="item.id">
        <CheckoutAsideProductLine :line="item" />
      </template>
    </div>
    <CheckoutAsideTotals />
    <button
      @click="$emit('submit')"
      :disabled="isLoading"
      class="t-mt-9 hover:t-bg-opacity-80 lg:t-mt-14 t-bg-black t-py-4 t-w-full disabled:t-bg-opacity-80"
    >
      <span v-if="!isLoading" class="t-text-white"> Перейти к оплате </span>
      <span v-else class="t-text-white">Переход к оплате...</span>
    </button>
  </aside>
</template>

<style scoped></style>
