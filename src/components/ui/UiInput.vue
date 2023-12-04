<script setup lang="ts">
import { Field } from "vee-validate";
defineProps<{
  name: string;
  label: string;
}>();
</script>
<template>
  <Field
    :name="name"
    :label="label"
    v-slot="{ value, handleChange }"
    as="label"
    class="t-border input-wrapper t-h-[48px] t-group t-border-black t-relative t-px-4 t-pb-[10px] t-flex t-items-center"
  >
    <span
      class="t-absolute input-label group-empty:t-top-auto group-empty:t-text-base t-top-1 t-text-[10px]"
      >{{ label }}</span
    >
    <InputText
      class="t-rounded-none input t-self-end t-text-base t-leading-[15px] focus:t-shadow-none t-w-full t-outline-none"
      :model-value="value"
      placeholder=""
      @update:model-value="handleChange"
    />
  </Field>
</template>

<style scoped>
.input-wrapper:focus {
}
.input-label {
  transition: all 0.1s ease-out;
}

.input-wrapper:has(input:focus),
.input-wrapper:has(input:focus-visible) {
  @apply t-ring-gray-800 t-ring-opacity-30 t-ring-2;
}

.input-wrapper:has(.input:placeholder-shown.input:not(:focus)) .input-label {
  top: calc(50% - 12px) !important;
  font-size: 16px !important;
}

.input {
}
</style>
