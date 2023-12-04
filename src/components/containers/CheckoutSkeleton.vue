<script setup lang="ts">
import CheckoutFormSkeleton from "../forms/CheckoutFormSkeleton.vue";
import CheckoutAsideSkeleton from "../aside/CheckoutAsideSkeleton.vue";
</script>

<template>
  <div
    class="t-grid t-grid-cols-1 lg:t-grid-cols-2 t-gap-11 lg:t-justify-center t-justify-items-center t-w-full"
  >
    <CheckoutFormSkeleton />
    <CheckoutAsideSkeleton />
  </div>
</template>

<style scoped></style>
