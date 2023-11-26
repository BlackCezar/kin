<script setup lang="ts">
import CheckoutSkeleton from "./components/containers/CheckoutSkeleton.vue";
import OrderResult from "./components/containers/OrderResult.vue";
import CheckoutContent from "./components/containers/CheckoutContent.vue";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";

const checkoutStore = useCheckout();
const {checkout, isFetching} = storeToRefs(checkoutStore)

onMounted(checkoutStore.loadCheckout)
</script>

<template>
  <CheckoutSkeleton v-if="isFetching" />
  <template v-else>
    <OrderResult v-if="checkout?.isClosed || checkout.status === ICheckoutStatus.PROCESS" />
    <CheckoutContent />
  </template>
</template>

<style scoped>

</style>