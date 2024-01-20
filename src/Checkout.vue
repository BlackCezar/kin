<script setup lang="ts">
import CheckoutSkeleton from "./components/containers/CheckoutSkeleton.vue";
import OrderResult from "./components/containers/OrderResult.vue";
import CheckoutContent from "./components/containers/CheckoutContent.vue";
import { storeToRefs } from "pinia";
import {onMounted, watch} from "vue";
import { useCheckout } from "./store/checkout.store.ts";
import { useSettings } from "./store/settings.store.ts";
import OrderError from "./components/containers/OrderError.vue";

const checkoutStore = useCheckout();
const settingsStore = useSettings();
const { checkout, isFetching, isFetchingCart, error, cart } =
  storeToRefs(checkoutStore);

settingsStore.loadSettings();

// const { instance, recaptchaLoaded } = useReCaptcha();

function setError() {
	console.log('!!!', checkout.value, cart.value, error.value)
	if (!checkout.value && cart.value?.items.length === 0) {
		checkoutStore.setError({
			status: 400,
			message: 'Корзина пуста',
			payload: {},
		})
	}
}
onMounted(() => {
	const params = new URLSearchParams(window.location.search);
	const checkoutId = params.get("id");
	const localStorageId = localStorage.getItem("checkout-id")
	if (checkoutId) {
		checkoutStore.setCheckoutId(checkoutId);
	} else if (localStorageId) {
		checkoutStore.setCheckoutId(localStorageId);
	}

	if (!checkout.value) {
		checkoutStore.loadCheckout().then(() => {
			if (checkout.value && !checkout.value?.isClosed) {
				checkoutStore.checkCart().then(setError)
			} else setError()

		})
	}

})

		// await recaptchaLoaded();
		// if (instance.value) instance.value.hideBadge();
</script>

<template>
  <div class="page-width">
	  <div>
		  <div v-if="isFetchingCart || isFetching">
			  <CheckoutSkeleton />
		  </div>
		  <div v-if="!isFetchingCart && error || !isFetching && error">
              <OrderError />
          </div>
		  <div v-if="!isFetchingCart && checkout && checkout.isClosed && !error || !isFetching && checkout && checkout.isClosed && !error">
              <OrderResult />
          </div>
		  <div></div>
		  <pre  v-if="!isFetchingCart && checkout && !checkout.isClosed && !error || !isFetching && checkout && !checkout.isClosed && !error">
			   <CheckoutContent  />
		  </pre>
	  </div>
  </div>
</template>

<style scoped></style>
