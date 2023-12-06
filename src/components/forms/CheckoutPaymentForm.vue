<script setup lang="ts">
import { useSettings } from "../../store/settings.store.ts";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useField } from "vee-validate";

const settingsStore = useSettings();
const { activePaymentTypes, isFetchingPaymentTypes } =
  storeToRefs(settingsStore);

onMounted(settingsStore.loadPaymentTypes);
const { value } = useField("paymentType");
</script>

<template>
  <div v-if="isFetchingPaymentTypes">
    <Skeleton height="48px" border-radius="0" />
  </div>
  <div v-else class="t-flex t-flex-col t-gap-3">
    <template v-for="item of activePaymentTypes" :key="item._id">
      <label class="t-flex radio-block t-cursor-pointer t-items-center">
        <RadioButton v-model="value" name="paymentType" :value="item.code" />
        <span class="radio-block-name">{{ item.title }}</span>
        <img
          class="t-ml-auto t-max-h-7"
          :src="`/${item.code}.svg`"
          :alt="item.title"
        />
      </label>
    </template>
  </div>
</template>

<style scoped>
.radio-block:has(.p-radiobutton-checked) .radio-block-name {
  @apply t-underline;
}
.radio-block .p-radiobutton {
  opacity: 0;
}
</style>
