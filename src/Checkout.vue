<script setup lang="ts">
import CheckoutSkeleton from "./components/containers/CheckoutSkeleton.vue";
import OrderResult from "./components/containers/OrderResult.vue";
import CheckoutContent from "./components/containers/CheckoutContent.vue";
import { storeToRefs } from "pinia";
import { getCurrentInstance, onMounted } from "vue";
import { useCheckout } from "./store/checkout.store.ts";
import { useSettings } from "./store/settings.store.ts";
import { useReCaptcha } from "vue-recaptcha-v3";

const checkoutStore = useCheckout();
const settingsStore = useSettings();
const { checkout, isFetching, isFetchingCart } = storeToRefs(checkoutStore);
const { instance } = useReCaptcha();

onMounted(() => {
  if (localStorage.getItem("checkout-id")) {
    checkoutStore.setCheckoutId(localStorage.getItem("checkout-id"));
  }
  checkoutStore.loadCheckout();
  settingsStore.loadSettings();

  if (instance.value) instance.value.hideBadge();
});
</script>

<template>
  <div class="page-width">
    <CheckoutSkeleton v-if="isFetching || isFetchingCart" />
    <template v-else-if="checkout">
      <OrderResult v-if="checkout.isClosed" />
      <CheckoutContent v-else />
    </template>
  </div>
</template>

<style scoped></style>
