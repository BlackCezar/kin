<script setup lang="ts">
import CheckoutSkeleton from "./components/containers/CheckoutSkeleton.vue";
import OrderResult from "./components/containers/OrderResult.vue";
import CheckoutContent from "./components/containers/CheckoutContent.vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useCheckout } from "./store/checkout.store.ts";
import { useSettings } from "./store/settings.store.ts";
import { useReCaptcha } from "vue-recaptcha-v3";
import { ICheckoutStatus } from "./types/checkout.ts";
import OrderError from "./components/containers/OrderError.vue";

const checkoutStore = useCheckout();
const settingsStore = useSettings();
const { checkout, isFetching, isFetchingCart, error, cart } =
  storeToRefs(checkoutStore);
const { instance, recaptchaLoaded } = useReCaptcha();

onMounted(async () => {
	try {
		const params = new URLSearchParams(window.location.search);
		const checkoutId = params.get("id");
		const localStorageId = localStorage.getItem("checkout-id")
		if (checkoutId) {
			checkoutStore.setCheckoutId(checkoutId);
		} else if (localStorageId) {
			checkoutStore.setCheckoutId(localStorageId);
		}
		if (!checkout.value) {
			await checkoutStore.loadCheckout()
			if (checkout.value && !checkout.value.isClosed) await checkoutStore.checkCart();


		}
		await settingsStore.loadSettings();
		console.log('!!!', checkout.value, cart.value)
		if (!checkout.value && cart.value?.items.length === 0) {
			checkoutStore.setError({
				status: 400,
				message: 'Корзина пуста',
				payload: {},
			})
		}
		console.log(error.value)
		await recaptchaLoaded();
		if (instance.value) instance.value.hideBadge();
	} catch (err: any) {
		console.log('Checkout err', err)
	}
});
</script>

<template>
  <div class="page-width">
        <CheckoutSkeleton v-if="isFetching || isFetchingCart" />
	    <template v-else-if="error">
	      <OrderError />
	    </template>
	    <template v-else-if="checkout">
		    <div  v-if="checkout.isClosed || checkout.status === ICheckoutStatus.PROCESS">
		    <Suspense>
		      <OrderResult />
			    <template #fallback>
				    Загрузка...
			    </template>
		    </Suspense>
		    </div>
	      <CheckoutContent v-else />
	    </template>
	  <div v-else>
		  <h2>Возникла ошибка</h2>
	  </div>
  </div>
</template>

<style scoped></style>
