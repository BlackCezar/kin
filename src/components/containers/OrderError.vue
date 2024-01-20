<script setup lang="ts">
import { useCheckout } from "../../store/checkout.store";
import { storeToRefs } from "pinia";
import CheckoutAsideProductLine from "../aside/CheckoutAsideProductLine.vue";
import { computed } from "vue";

const checkoutStore = useCheckout();
const { error, cart } = storeToRefs(checkoutStore);

const errorItems = computed(() => {
  if ([422, 406].includes(error.value?.status) && cart.value?.items) {
    const item = cart.value.items.find(
      (i) => i.id === Number(error.value.payload.id),
    );
    return item ? [item] : [];
  }
});
</script>

<template>
  <div>
	  <pre>{{error}}</pre>
    <div v-if="error?.status === 422 || error?.status === 406">
      <aside class="t-max-w-[544px] t-mx-auto t-w-full t-min-w-[352px]">
        <div class="t-mb-9">
          <h2 class="t-h2 t-text-center t-pl-5 lg:t-pl-7 t-mb-5">
            Ошибка при оформлении заказа
          </h2>
	        <p class="t-text-center" v-if="error?.message">{{error?.message}}</p>
        </div>
        <div
          class="t-gap-6 t-mb-12"
        >
          <div class="t-grid t-grid-cols-[88px_auto] lg:t-grid-cols-[132px_auto] " v-for="item of errorItems" :key="item.id">
            <CheckoutAsideProductLine :error="error.message" :line="item" />
          </div>
        </div>
      </aside>
    </div>
    <div v-else-if="error?.status === 400">
      <div class="t-mb-9">
        <h2 class="t-h2 t-text-center t-mb-5">Ошибка при оформлении заказа</h2>
	      <p class="t-text-center" v-if="error?.message">{{error.message}}</p>
      </div>
    </div>
    <div class="t-flex t-justify-center t-w-full t-mt-auto t-gap-4">
      <a href="/">На главную</a>
      <button type="button" @click="checkoutStore.reCreate">
        Попробовать заново
      </button>
      <a href="/cart">В корзину</a>
    </div>
  </div>
</template>

<style scoped></style>
