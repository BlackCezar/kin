<script setup lang="ts">
import {useCheckout} from "../../store/checkout.store.ts";
import {storeToRefs} from "pinia";
import toMoney from "../../composables/toMoney.ts";
import {useDelivery} from "../../store/delivery.store.ts";

const checkoutStore = useCheckout()
const deliveryStore = useDelivery();
const { amount: deliveryAmount } = storeToRefs(deliveryStore);
const {cart, isFetchingCart, discount} = storeToRefs(checkoutStore)
</script>

<template>
  <div class="t-flex t-w-full t-flex-col t-gap-4" v-if="cart && isFetchingCart === false">
    <div class="t-flex t-justify-between">
      <span>Сумма</span>
      <span>{{toMoney(cart.items_subtotal_price)}}</span>
    </div>
    <div class="t-flex t-justify-between">
      <span>Стоимость доставки</span>
      <span>{{toMoney(deliveryAmount)}}</span>
    </div>
    <div class="t-flex t-justify-between">
      <span>Скидка</span>
      <span>{{toMoney(discount)}}</span>
    </div>
    <div class="t-w-full t-h-px !t-block t-border t-border-black"></div>
    <div class="t-flex t-justify-between">
      <span>ИТОГ</span>
      <span>{{toMoney(cart.total_price + deliveryAmount)}}</span>
    </div>
  </div>
</template>

<style scoped>

</style>