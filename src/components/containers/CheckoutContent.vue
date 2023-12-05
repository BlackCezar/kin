<script setup lang="ts">
import CheckoutForm from "../forms/CheckoutForm.vue";
import CheckoutAside from "../aside/CheckoutAside.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

const {} = useForm({
  validationSchema: yup.object().shape({
    username: yup.string().required('Заполните имя'),
    email: yup
    .string()
        .email("Неверный формат email")
        .matches(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Неверный формат email",
        )
        .required("Заполните email"),
    phone: yup.string().required(),
    deliveryType: yup.string().required(),
    deliveryAddress: yup.string().required()
  }),
  initialValues: {
    username: '',
    email: '',
    phone: '',
    deliveryType: 'delivery'
  },
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
