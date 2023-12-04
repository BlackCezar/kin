<script setup lang="ts">
import CheckoutSkeleton from "./components/containers/CheckoutSkeleton.vue";
import OrderResult from "./components/containers/OrderResult.vue";
import CheckoutContent from "./components/containers/CheckoutContent.vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useCheckout } from "./store/checkout.store.ts";
import { useSettings } from "./store/settings.store.ts";

const checkoutStore = useCheckout();
const settingsStore = useSettings();
const { checkout, isFetching, isFetchingCart } = storeToRefs(checkoutStore);

onMounted(() => {
  if (localStorage.getItem("checkout-id")) {
    checkoutStore.setCheckoutId(localStorage.getItem("checkout-id"));
  }
  checkoutStore.loadCheckout();
  settingsStore.loadSettings();
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
