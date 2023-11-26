import {defineStore} from "pinia";
import {ICheckoutState} from "../types/checkout.ts";

export const useCheckout = defineStore('checkout', {
    state: (): ICheckoutState => ({
        checkout: null,
        cart: null,
        isLoading: false,
        isFetchingCart: false,
        checkoutId: null
    })
})