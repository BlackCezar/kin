<script setup lang="ts">
import CheckoutSkeleton from "./components/containers/CheckoutSkeleton.vue";
import OrderResult from "./components/containers/OrderResult.vue";
import CheckoutContent from "./components/containers/CheckoutContent.vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useCheckout } from "./store/checkout.store.ts";
import { useSettings } from "./store/settings.store.ts";
import { useReCaptcha } from "vue-recaptcha-v3";
import { ICheckoutStatus } from "./types/checkout.ts";
import OrderError from "./components/containers/OrderError.vue";

const checkoutStore = useCheckout();
const settingsStore = useSettings();
const { checkout, isFetching, isFetchingCart, error } =
  storeToRefs(checkoutStore);
const { instance } = useReCaptcha();

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const checkoutId = params.get("id");
  if (checkoutId) {
    checkoutStore.setCheckoutId(checkoutId);
  } else if (localStorage.getItem("checkout-id")) {
    checkoutStore.setCheckoutId(localStorage.getItem("checkout-id"));
  }
  checkoutStore.loadCheckout().then(checkoutStore.checkCart);
  settingsStore.loadSettings();

  if (instance.value) instance.value.hideBadge();
});
</script>

<template>
  <div class="page-width">
    <CheckoutSkeleton v-if="isFetching || isFetchingCart" />
    <template v-else-if="error">
      <OrderError />
    </template>
    <template v-else-if="checkout">
      <OrderResult
        v-if="checkout.isClosed || checkout.status === ICheckoutStatus.PROCESS"
      />
      <CheckoutContent v-else />
    </template>
  </div>
</template>

<style scoped></style>
