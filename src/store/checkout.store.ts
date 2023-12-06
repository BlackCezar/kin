import { defineStore } from "pinia";
import {
  ICheckout,
  ICheckoutPaymentResponse,
  ICheckoutState,
} from "../types/checkout.ts";
import ky from "ky";
import { IShopifyCart } from "../types/shopify.ts";
import { client } from "../composables/api.client.ts";
import { PaymentStatus } from "../types/payment";
import { toast } from "vue3-toastify";

export const useCheckout = defineStore("checkout", {
  state: (): ICheckoutState => ({
    checkout: null,
    cart: null,
    isFetchingCart: false,
    isFetching: false,
    checkoutId: null,
    isLoading: false,
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
    isMatch() {
      if (!this.checkout || !this.cart) return false;
      const amount = this.checkout.items.reduce(
        (acc, item) => (acc += item.price),
        0,
      );
      const cartAmount = this.cart.items.reduce(
        (acc, item) => (acc += item.price),
        0,
      );
      if (amount !== cartAmount) return false;
      if (this.checkout.items.length !== this.cart.items.length)
        for (const item of this.cart.items) {
          const hasInCheckout = this.checkout.items.find(
            (i) =>
              i.variantId === `gid://Shopify/ProductVariant/${item.variant_id}`,
          );
          if (!hasInCheckout) return false;
          if (item.quantity !== hasInCheckout.count) return false;
        }
      return true;
    },
    async toPayment(values, token: string) {
      this.isLoading = true;
      try {
        if (this.checkout && this.isMatch()) {
          const paymentResult = await client
            .post("cart/payment", {
              json: {
                _id: this.checkoutId,
                contacts: {
                  email: values.email,
                  phone: values.phone,
                  username: values.username,
                },
                token,
                delivery: {
                  address: values.deliveryAddress,
                  type: values.deliveryType,
                  addressObject: values.deliveryObject,
                },
                payment: values.paymentType,
              },
            })
            .json<ICheckoutPaymentResponse>();

          if (paymentResult?.redirect) {
            this.isLoading = false;
            window.location.href = paymentResult.redirect;
          }
        } else {
          toast.error(
            "Во время перехода к оплате возникла ошибка, попробуйте еще раз",
          );
        }
      } catch (err: any) {
        console.trace(err);
        console.dir(err);
        toast.error(err.message ?? "Возникла ошибка при оформлении заказа");
        this.isLoading = false;
      }
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
