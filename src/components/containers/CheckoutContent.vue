<script setup lang="ts">
import CheckoutForm from "../forms/CheckoutForm.vue";
import CheckoutAside from "../aside/CheckoutAside.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useReCaptcha } from "vue-recaptcha-v3";
import { useCheckout } from "../../store/checkout.store.ts";
import { toast } from "vue3-toastify";
import {storeToRefs} from "pinia";

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();
const recaptcha = async () => {
  await recaptchaLoaded();
  return await executeRecaptcha("submit");
};

const checkoutStore = useCheckout();
const {checkout} = storeToRefs(checkoutStore)

const { handleSubmit } = useForm({
  validationSchema: yup.object().shape({
    username: yup.string().required("Заполните имя"),
    email: yup
      .string()
      .email("Неверный формат email")
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Неверный формат email",
      )
      .required("Заполните email"),
    phone: yup.string().required(),
    deliveryType: yup.string().required("Выберите способ доставки"),
    deliveryAddress: yup.string().required("Выберите адрес доставки"),
    deliveryObject: yup.lazy((_value, options) => {
      console.log(options.parent.deliveryType);
      if (options.parent.deliveryType === "self") {
        return yup.object().shape({
          id: yup.string().required("Выберите пункт"),
          address: yup.mixed(),
        });
      } else
        return yup
          .object()
          .shape({
            data: yup
              .object()
              .shape({
                house: yup.string().required("Укажите дом").min(1),
                city: yup
                  .string()
                  .optional()
                  .nullable()
                  .test(function (val, ctx) {
                    const { settlement } = this.parent;
                    if (!settlement || settlement.trim().length === 0) {
                      if (!val || val.trim() === "")
                        ctx.createError({ message: "Укажите город" });
                    }
                    return true;
                  }),
                settlement: yup
                  .string()
                  .optional()
                  .nullable()
                  .test(function (val, ctx) {
                    const { city } = this.parent;
                    if (!city || city.trim().length === 0) {
                      if (!val || val.trim() === "")
                        ctx.createError({
                          message: "Укажите населенный пункт",
                        });
                    }
                    return true;
                  }),
              })
              .required("Укажите адрес"),
          })
          .required("Укажите адрес");
    }),
    paymentType: yup
      .string()
      .oneOf(["yookassa", "yookassa_sbp"], "Неверный способ оплаты")
      .required(),
  }),
  initialValues: {
    username: checkout.value?.contacts?.username ?? "",
    email: checkout.value?.contacts?.email ?? "",
    phone: checkout.value?.contacts?.phone ?? "",
    deliveryType: checkout.value?.delivery?.type ?? "delivery",
    paymentType: checkout.value?.paymentType ?? "yookassa",
    deliveryAddress: checkout.value?.delivery?.address ?? '',
    deliveryObject: checkout.value?.delivery?.addressObject ?? null,
  },
});

var processForm = handleSubmit(async (values) => {
  console.log("values", values);
  const token = await recaptcha();
  const result = checkoutStore.toPayment(values, token);

  if (result && "status" in result && result.status === 422) {
    //@ts-ignore
    setFieldError(result.payload.id, result.message);
  } else if (result && "status" in result && result.status === 406) {
    //@ts-ignore
    setFieldError(result.payload.id, result.message);
  } else if (result && "message" in result && result.message) {
    toast.error(result.message);
  }
});
</script>

<template>
  <div
    class="t-grid t-grid-cols-1 lg:t-grid-cols-2 t-gap-11 lg:t-justify-center t-justify-items-center t-w-full"
  >
    <CheckoutForm />
    <CheckoutAside @submit="processForm" />
  </div>
</template>

<style scoped></style>
