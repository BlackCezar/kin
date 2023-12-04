<script setup lang="ts">
import CheckoutForm from "../forms/CheckoutForm.vue";
import CheckoutAside from "../aside/CheckoutAside.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

const {} = useForm({
  validationSchema: yup.object().shape(),
  initialValues: {},
});
</script>

<template>
  <div
    class="t-grid t-grid-cols-1 lg:t-grid-cols-2 t-gap-11 lg:t-justify-center t-justify-items-center t-w-full"
  >
    <CheckoutForm />
    <CheckoutAside />
  </div>
</template>

<style scoped></style>
