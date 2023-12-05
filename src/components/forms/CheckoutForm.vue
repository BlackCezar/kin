<script setup lang="ts">
import UiInput from "../ui/UiInput.vue";
import CheckoutDeliveryForm from "./CheckoutDeliveryForm.vue";
</script>

<template>
  <div class="t-flex t-flex-col t-w-full t-gap-8 lg:t-gap-13 t-max-w-[576px]">
    <div class="t-flex t-flex-col t-gap-3">
      <h2 class="t-h2 t-pl-5 lg:t-pl-7 lg:t-mb-3">Получатель</h2>
      <UiInput name="username" label="Имя" autocomplete="shipping name" />
      <UiInput name="email" type="email" label="Почта" autocomplete="shipping email"/>
      <UiInput name="phone" type="tel" label="Телефон" autocomplete="shipping tel" />
    </div>
    <div>
      <h2 class="t-h2 t-pl-5 lg:t-pl-7 t-mb-5">Доставка</h2>
      <CheckoutDeliveryForm />
    </div>
    <div>
      <h2 class="t-h2 t-pl-5 lg:t-pl-7 t-mb-5">Способ оплаты</h2>
      <Skeleton height="48px" border-radius="0" />
    </div>
  </div>
</template>

<style scoped></style>
