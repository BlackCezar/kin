import {createPinia} from "pinia";
import {createApp} from "vue";
import Vue3Toastify from "vue3-toastify";
import * as yup from "yup";
import Checkout from "./Checkout.vue";

const pinia = createPinia()
const app = createApp(Checkout)

app.use(pinia)
app.use(Vue3Toastify, {
    autoClose: 3000
})

app.mount('#cart')

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
