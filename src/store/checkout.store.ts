import { defineStore } from "pinia";
import {
  ICheckout,
  ICheckoutPaymentResponse,
  ICheckoutState,
  ICheckoutStatus,
} from "../types/checkout.ts";
import ky from "ky";
import { IShopifyCart } from "../types/shopify.ts";
import { client } from "../composables/api.client.ts";
import { PaymentStatus } from "../types/payment";
import { toast } from "vue3-toastify";
import { state } from "vue-tsc/out/shared";

export const useCheckout = defineStore("checkout", {
  state: (): ICheckoutState => ({
    checkout: null,
    cart: null,
    error: null,
    isFetchingCart: false,
    isFetching: false,
    isDiscounting: false,
    checkoutId: null,
    isLoading: false,
  }),
  getters: {
    total: (state) => state.cart?.total_price ?? 0,
    discount: (state) => state.cart?.total_discount ?? 0,
    hasDiscount: (state) =>
      state.cart?.cart_level_discount_applications?.find(
        (item) => item.type === "discount_code",
      ),
    isPaid: (state) => {
      if (
        [PaymentStatus.PAID, PaymentStatus.APPROVED].includes(
          state.checkout?.payment?.status,
        )
      )
        return true;

      if (state.checkout?.orderId) return true;

      if (
        [ICheckoutStatus.COMPLETED, ICheckoutStatus.PROCESS].includes(
          state.checkout?.status,
        ) &&
        state.checkout?.orderId
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
        (acc, item) => (acc += item.price * item.count),
        0,
      );
      const cartAmount = this.cart.items.reduce(
        (acc, item) => (acc += item.price * item.quantity),
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
    async clearDiscount() {
      this.isDiscounting = true;
      try {
        await ky.get("/discount/null");
        await ky.post("/cart/update.js", {
          json: {
            attributes: {
              discount: null,
            },
          },
        });
        await this.fetchCart();
      } catch (err: any) {
        if (err.name === "HTTPError") {
          const errorJson = await err.response.json();
          this.error = errorJson;
          this.isFetching = false;
        } else {
          toast.error(err.message ?? "Ошибка очистки промокода");
          this.isLoading = false;
        }
      }
      this.isDiscounting = false;
    },
    async appendDiscount(discount: string) {
      this.isDiscounting = true;
      try {
        await ky.get("/discount/" + discount);
        await ky.post("/cart/update.js", {
          json: {
            attributes: {
              discount: discount,
            },
          },
        });
        await this.fetchCart();
      } catch (err: any) {
        if (err.name === "HTTPError") {
          const errorJson = await err.response.json();
          this.error = errorJson;
          this.isFetching = false;
        } else {
          toast.error(err.message ?? "Промокод не найден");
          this.isLoading = false;
        }
      }
      this.isDiscounting = false;
    },
    async toPayment(values, token: string) {
      this.isLoading = true;
      try {
        if (this.checkout && this.isMatch()) {
          await this.checkCart();
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
                discountApplications:
                  this.cart.cart_level_discount_applications,
              },
            })
            .json<ICheckoutPaymentResponse>();

          if (paymentResult?.redirect) {
            this.isLoading = false;
            window.location.href = paymentResult.redirect;
          } else {
            return paymentResult
          }
        } else {
          toast.error(
            "Во время перехода к оплате возникла ошибка, попробуйте еще раз",
          );
        }
      } catch (err: any) {
        if (err.name === "HTTPError") {
          const errorJson = await err.response.json();
          this.error = errorJson;
          console.log("err", errorJson);

          this.isFetching = false;
        } else {
          console.trace(err);
          console.dir(err);
          toast.error(err.message ?? "Возникла ошибка при оформлении заказа");
          this.isLoading = false;
        }
      }
    },
    async reCreate() {
      this.isFetching = true;
      console.log("ReCreate started", this.cart);
      if (!this.cart || this.cart?.item_count === 0) return;
      try {
        const result = await client
          .post("cart", {
            json: {
              refresh: true,
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
          const params = new URLSearchParams(window.location.search);
          params.set("id", result.object._id);
          window.location.search = "?" + params.toString();
          this.isFetching = false;
        }

        this.isFetching = false;
      } catch (err: any) {
        if (err.name === "HTTPError") {
          const errorJson = await err.response.json();
          this.error = errorJson;
          console.log("err", errorJson);

          this.isFetching = false;
        }
      }
    },
    async fetchCart() {
      this.cart = await ky.get("/cart.js").json<IShopifyCart>();
      console.log("cart loaded");
    },
    setError(err: ICheckoutState['error']) {
      this.error = err
    },
    async fetchCheckout() {
      const result = await client.get(`cart/${this.checkoutId}`).json<{
        object: ICheckout;
      }>();
      console.log('[fetchCheckout] checkout is ', result?.object)
      if (result?.object?._id) {
        this.checkout = result.object;

        if (!this.checkout.isClosed) return;

        if (this.checkout.isClosed && this.checkout.orderId) {
          if (this.cart?.token === this.checkout.id) {
            localStorage.removeItem("checkout-id");
            document.cookie = document.cookie.split(';').filter(item => {
              const [key] = item.split('=')
              return key.trim() !== 'cart'
            }).join(';')
          }

          return;
        } else if (this.checkout.isClosed && !this.checkout.orderId) {
          this.checkout = null;
          this.checkoutId = null;
          await this.reCreate();
        }
      }
    },
    async checkCart() {
      this.isFetching = true;

      try {
        console.log("[checkCart]");
        const result = await client.post("cart/check", {
          json: {
            items: this.cart?.items.map((c) => ({
              id: c.id,
              product_type: c.product_type,
              quantity: c.quantity,
            })),
          },
        }).json();
        console.log('result', result)
      } catch (err: any) {
        if (err.name === "HTTPError") {
          const errorJson = await err.response.json();
          this.error = errorJson;
          console.log("[checkCart] error", errorJson);
        }
      }
      this.isFetching = false;
    },
    async loadCheckout() {
      this.isFetchingCart = true;
      console.log('Fetch cart started')
      await this.fetchCart();
      console.log('Fetch cart ended, token is ', this.cart?.token)
      this.isFetching = true;
      this.isFetchingCart = false;
      if (this.checkoutId) {
        console.log("has checkoutId", this.checkoutId);
        try {
          console.log('Fetch checkout started')
          await this.fetchCheckout();
          console.log('Fetch checkout ended')
          this.isFetching = false;
        } catch (err: any) {
          if (err.name === "HTTPError") {
            const errorJson = await err.response.json();
            this.error = errorJson;
            console.log("[loadCheckout] err on fetchCheckout", errorJson);
            if (errorJson.status === 400 && this.cart.items.length) {
              this.checkout = null;
              this.checkoutId = null;
              this.reCreate();
            } else {
              this.isFetching = false;
            }
          }
        }
      } else if (this.cart?.items.length) {
        try {
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

            const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + result.object._id
            window.history.pushState({path:newurl},'',newurl);
          }
        } catch (err: any) {
          if (err.name === "HTTPError") {
            const errorJson = await err.response.json();
            this.error = errorJson;
            console.log("[loadCheckout] err", errorJson);

            this.isFetching = false;
          }
        }
      }
      this.isFetching = false;
    },
  },
});
