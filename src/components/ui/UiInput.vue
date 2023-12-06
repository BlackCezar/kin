<script setup lang="ts">
import { Field } from "vee-validate";
import { InputHTMLAttributes } from "vue";
defineProps<{
  name: string;
  label: string;
  type?: InputHTMLAttributes["type"];
  readonly?: InputHTMLAttributes["readonly"];
  autocomplete?: InputHTMLAttributes["autocomplete"];
}>();
</script>
<template>
  <Field
    :name="name"
    :label="label"
    v-slot="{ value, handleChange, errorMessage, meta, handleBlur }"
    as="label"
    class="t-border input-wrapper t-h-[48px] t-group t-border-black t-relative t-px-4 t-pb-[10px] t-flex t-items-center"
  >
    <span
      class="t-absolute input-label group-empty:t-top-auto group-empty:t-text-base t-top-1 t-text-[10px]"
      >{{ label }}</span
    >
    <InputMask
      class="t-rounded-none input t-self-end t-text-base t-leading-[15px] focus:t-shadow-none t-w-full t-outline-none"
      :model-value="value"
      placeholder=""
      v-if="type === 'tel'"
      :readonly="readonly"
      @blur="handleBlur"
      mask="+7 999 999 99-99"
      type="tel"
      :autocomplete="autocomplete"
      @update:model-value="handleChange"
    />
    <InputText
      v-else
      class="t-rounded-none input t-self-end t-text-base t-leading-[15px] focus:t-shadow-none t-w-full t-outline-none"
      :model-value="value"
      placeholder=""
      :readonly="readonly"
      @blur="handleBlur"
      :type="type ? type : 'text'"
      :autocomplete="autocomplete"
      @update:model-value="handleChange"
    />
    <div
      v-if="errorMessage"
      class="t-absolute t-right-4 t-text-[#C62424] t-top-4 t-flex t-gap-2 t-items-center"
    >
      <span class="t-text-[10px]">{{ errorMessage }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.80764 5.09358L1.30624 0.501464L0.592112 1.20148L5.09352 5.7936L0.501407 10.295L1.20143 11.0091L5.79354 6.50773L10.2949 11.0998L11.009 10.3998L6.50766 5.80771L11.0998 1.30633L10.3997 0.592201L5.80764 5.09358Z"
          fill="currentColor"
        />
      </svg>
    </div>
    <div class="t-absolute t-top-4 t-right-4" v-if="meta.touched && meta.valid">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="12"
        viewBox="0 0 15 12"
        fill="none"
      >
        <path
          d="M1 5.09091L5.58824 10L14 1"
          stroke="#3F9F2F"
          stroke-width="1.5"
        />
      </svg>
    </div>
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

.input-wrapper:has(.input:placeholder-shown.input:not(:focus)) .input-label,
.input-wrapper:has(.input:placeholder-shown[readonly]) .input-label {
  @apply t-text-gray-500;
  top: calc(50% - 12px) !important;
  font-size: 16px !important;
}

.input {
}
</style>
