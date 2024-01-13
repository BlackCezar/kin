<script setup lang="ts">
import { IShopifyCartItem } from "../../types/shopify.ts";
import { computed } from "vue";
import toMoney from "../../composables/toMoney.ts";

const props = defineProps<{
  line: IShopifyCartItem;
  error?: string;
}>();

// const color = computed(() => props.line.options_with_values.find(i => i.name === 'color'))
const size = computed(() =>
  props.line.options_with_values.find((i) => i.name === "size"),
);
</script>

<template>
  <div class="t-aspect-square t-w-full t-h-auto">
    <a :href="`/products/${line.handle}`">
      <img v-if="line.image" :src="line.image" :alt="line.title" />
    </a>
  </div>
  <div class="t-flex t-w-full t-flex-col t-gap-1">
    <div class="t-text-base t-line-clamp-1">
      <a :href="`/products/${line.handle}`">{{ line.title }}</a>
    </div>
    <div
      class="t-text-base t-line-clamp-1 -t-mt-2 t-uppercase t-text-[#6D7175]"
    >
      {{ line.variant_options[0] }}
    </div>
    <div class="t-flex t-justify-between">
      <span>{{ size?.value }}</span>
      <span>x{{ line.quantity }}</span>
    </div>
    <div class="t-flex t-justify-between">
      <span>{{ line.vendor }}</span>
      <div class="t-flex t-flex-col lg:t-flex-row">
        <span>{{ toMoney(line.price) }}</span>
      </div>
    </div>
    <div v-if="error" class="error-text">{{ error }}</div>
  </div>
</template>

<style scoped></style>
