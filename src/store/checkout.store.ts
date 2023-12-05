import { defineStore } from "pinia";
import { ICheckout, ICheckoutState } from "../types/checkout.ts";
import ky from "ky";
import { IShopifyCart } from "../types/shopify.ts";
import { client } from "../composables/api.client.ts";
import { PaymentStatus } from "../types/payment";

export const useCheckout = defineStore("checkout", {
  state: (): ICheckoutState => ({
    checkout: null,
    cart: null,
    isFetchingCart: false,
    isFetching: false,
    checkoutId: null,
  }),
  getters: {
    discount: (state) => state.cart?.total_discount ?? 0,
    isPaid: (state) => {
      if (
        [PaymentStatus.PAID, PaymentStatus.APPROVED].includes(
          state.checkout?.payment?.status,
        )
      )
        return true;

      return false;
    },
  },
  actions: {
    setCheckoutId(id: string) {
      this.checkoutId = id;
    },
    async reCreate() {
      this.isFetching = true;
      if (!this.cart) return;

      const result = await client
        .post("cart", {
          json: {
            token: this.cart.token,
            codes: this.cart.attributes?.discount
              ? [this.cart.attributes.discount]
              : [],
            items: this.cart.items.map((item) => ({
              quantity: item.quantity,
              price: item.price,
              discount: item.original_price - item.discounted_price,
              allocations: item.line_level_discount_allocations?.length
                ? item.line_level_discount_allocations
                : [],
              title: item.title,
              vendor: item.vendor,
              product_title: item.product_title,
              product_type: item.product_type,
              size: item.variant_title,
              image: item.featured_image,
              description: item.product_description,
              id: item.id,
              variantId: "gid://shopify/ProductVariant/" + item.variant_id,
            })),
          },
        })
        .json<{
          object: ICheckout;
        }>();
      console.log("create checkout response", result);
      if (result?.object?._id) {
        this.checkoutId = result.object._id;
        this.checkout = result.object;
        localStorage.setItem("checkout-id", result.object._id);
        this.isFetching = false;
      }

      this.isFetching = false;
    },
    async loadCheckout() {
      this.isFetchingCart = true;
      this.cart = await ky.get("/cart.js").json<IShopifyCart>();
      console.log("cart loaded");
      this.isFetchingCart = false;
      this.isFetching = true;

      if (this.checkoutId) {
        console.log("has checkoutId");
        const result = await client
          .get(`cart/${this.checkoutId}`)
          .json<{ object: ICheckout }>();
        if (result?.object?._id) {
          this.checkout = result.object;
          this.isFetching = false;
        }
      } else if (this.cart.items.length) {
        const result = await client
          .post("cart", {
            json: {
              token: this.cart.token,
              codes: this.cart.attributes?.discount
                ? [this.cart.attributes.discount]
                : [],
              items: this.cart.items.map((item) => ({
                quantity: item.quantity,
                price: item.price,
                discount: item.original_price - item.discounted_price,
                allocations: item.line_level_discount_allocations?.length
                  ? item.line_level_discount_allocations
                  : [],
                title: item.title,
                vendor: item.vendor,
                product_title: item.product_title,
                product_type: item.product_type,
                size: item.variant_title,
                image: item.featured_image,
                description: item.product_description,
                id: item.id,
                variantId: "gid://shopify/ProductVariant/" + item.variant_id,
              })),
            },
          })
          .json<{
            object: ICheckout;
          }>();
        console.log("create checkout response", result);
        if (result?.object?._id) {
          this.checkoutId = result.object._id;
          this.checkout = result.object;
          localStorage.setItem("checkout-id", result.object._id);
          this.isFetching = false;
        }
      }
    },
  },
});
