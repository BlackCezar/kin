import { createPinia } from "pinia";
import { createApp } from "vue";
import Vue3Toastify from "vue3-toastify";
import * as yup from "yup";
import Checkout from "./Checkout.vue";
import Skeleton from "primevue/skeleton";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import SelectButton from "primevue/selectbutton";
import AutoComplete from "primevue/autocomplete";
import RadioButton from "primevue/radiobutton";
import PrimeVue from "primevue/config";
import { createYmaps } from "vue-yandex-maps";
import "primevue/resources/themes/lara-light-amber/theme.css";
import "vue3-toastify/dist/index.css";
import "../css/frontend.css";
import { VueReCaptcha } from "vue-recaptcha-v3";

const pinia = createPinia();
const app = createApp(Checkout);

app.use(pinia);
app.use(PrimeVue);
app.component("Skeleton", Skeleton);
app.component("InputText", InputText);
app.component("InputMask", InputMask);
app.component("SelectButton", SelectButton);
app.component("AutoComplete", AutoComplete);
app.component("RadioButton", RadioButton);
app.use(
  createYmaps({
    apikey: process.env.VUE_APP_YMAPS_KEY,
  }),
);

app.use(VueReCaptcha, {
  siteKey: process.env.VUE_APP_RECAPTCHA,
});

app.use(Vue3Toastify, {
  autoClose: 3000,
});

app.mount("#checkout");

yup.setLocale({
  string: {
    email: "Неверный формат email",
    min: ({ min }) => `Минимум ${min}`,
    length: ({ length }) => `Минимум ${length}`,
    max: ({ max }) => `Максимум ${max}`,
  },
  mixed: {
    default: "Заполните поле корректно",
    required: "Поле обязательно",
  },
  tuple: {
    notType: "Неверный формат",
  },
});
