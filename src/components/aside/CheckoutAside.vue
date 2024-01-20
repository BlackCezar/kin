<script setup lang="ts">
import UiInput from "../ui/UiInput.vue";
import * as yup from "yup";
import { useForm } from "vee-validate";
import CheckoutAsideProductLine from "./CheckoutAsideProductLine.vue";
import { useCheckout } from "../../store/checkout.store.ts";
import { storeToRefs } from "pinia";
import CheckoutAsideTotals from "./CheckoutAsideTotals.vue";
import { onMounted } from "vue";

const checkoutStore = useCheckout();
const { cart, isLoading, isDiscounting, hasDiscount } =
  storeToRefs(checkoutStore);
const { handleSubmit, setFieldValue, values, setFieldError } = useForm({
  validationSchema: yup.object().shape({
    promoCode: yup.string().optional().min(4),
  }),
  initialValues: {
    promoCode: "",
  },
});

onMounted(() => {
  if (hasDiscount.value) {
    console.log("onMounted");
    setFieldValue(
      "promoCode",
      cart.value?.cart_level_discount_applications?.find(
        (item) => item.type === "discount_code",
      )?.title ?? '',
    );
  }
});

const processPromoCode = handleSubmit(async (values) => {
  if (values.promoCode?.trim()) {
    if (
      !cart.value?.attributes.discount ||
      cart.value.attributes.discount !== values.promoCode
    ) {
      await checkoutStore.appendDiscount(values.promoCode);
      if (!cart.value?.attributes.discount)
        setFieldError("promoCode", "Промокод не найден");
    }
  }
});
const onBlur = async () => {
  if (
    !values.promoCode?.trim() &&
    cart.value?.attributes.discount &&
    !isDiscounting.value
  ) {
    await checkoutStore.clearDiscount();
    setFieldError("promoCode", "");
  } else if (values.promoCode?.trim() && cart.value?.attributes.discount) {
    await checkoutStore.appendDiscount(values.promoCode);
  }
};
</script>

<template>
  <div class="t-max-w-[544px] t-w-full t-min-w-[352px]">
    <form @submit.prevent="processPromoCode" class="t-mb-9">
      <h2 class="t-h2 t-pl-5 lg:t-pl-7 t-mb-5">Детали заказа</h2>
      <UiInput @blur="onBlur" label="Промокод" name="promoCode" />
    </form>
    <div
      class="t-mb-12"
    >
      <div class="t-grid t-grid-cols-[88px_auto] t-gap-6 lg:t-grid-cols-[132px_auto]" v-for="item of cart?.items" :key="item.id">
        <CheckoutAsideProductLine :line="item" />
      </div>
    </div>
	  <div>
    <CheckoutAsideTotals />
	  </div>
    <button
      @click="$emit('submit')"
      :disabled="isLoading || isDiscounting"
      class="t-mt-9 t-transition-colors hover:t-bg-opacity-80 lg:t-mt-14 t-bg-black t-py-4 t-w-full"
      :class="{
        't-bg-opacity-80': isLoading || isDiscounting,
      }"
    >
      <span v-if="!isLoading" class="t-text-white"> Перейти к оплате </span>
      <span v-else class="t-text-white">Переход к оплате...</span>
    </button>
  </div>
</template>

<style scoped></style>
