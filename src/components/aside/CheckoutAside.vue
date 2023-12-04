<script setup lang="ts">
import UiInput from "../ui/UiInput.vue";
import * as yup from "yup";
import { useForm } from "vee-validate";

const {} = useForm({
  validationSchema: yup.object().shape({
    promoCode: yup.string().optional().min(4),
  }),
  initialValues: {
    promoCode: "",
  },
});
</script>

<template>
  <aside class="t-max-w-[544px] t-w-full t-min-w-[352px]">
    <div class="t-mb-9">
      <h2 class="t-h2 t-pl-5 lg:t-pl-7 t-mb-5">Детали заказа</h2>
      <UiInput label="Промокод" name="promoCode" />
    </div>
    <div
      class="t-grid t-grid-cols-[88px_auto] lg:t-grid-cols-[132px_auto] t-gap-6 t-mb-12"
    >
      <Skeleton
        shape="rectangle"
        border-radius="0"
        class="t-aspect-square t-w-full t-h-auto"
      />
      <div class="t-flex t-w-full t-flex-col t-gap-1">
        <Skeleton height="20px" border-radius="0" />
        <Skeleton height="16px" border-radius="0" />
      </div>
    </div>
    <div class="t-flex t-w-full t-flex-col t-gap-4">
      <Skeleton height="16px" border-radius="0" />
      <Skeleton height="16px" border-radius="0" />
      <Skeleton height="16px" border-radius="0" />
      <div class="t-w-full t-h-px !t-block t-border t-border-black"></div>
      <Skeleton height="16px" border-radius="0" />
      <Skeleton height="48px" border-radius="0" class="t-mt-9 lg:t-mt-14" />
    </div>
  </aside>
</template>

<style scoped></style>
