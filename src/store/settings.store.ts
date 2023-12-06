import { defineStore } from "pinia";
import { client } from "../composables/api.client";
import { IPaymentType } from "../types/payment";
import { IMessages } from "../types/checkout";
import { ISettingsState } from "../types/settings";

export const useSettings = defineStore("settings", {
  state: (): ISettingsState => ({
    paymentTypes: [],
    messages: null,
    isFetchingPaymentTypes: false,
    isFetchingSettings: false,
  }),
  getters: {
    activePaymentTypes: (state) => state.paymentTypes.filter((p) => p.isActive),
  },
  actions: {
    async loadPaymentTypes() {
      this.isFetchingPaymentTypes = true;
      const result = await client
        .get("cart/payments")
        .json<{ array?: IPaymentType[] }>();
      if (result?.array && Array.isArray(result.array)) {
        this.paymentTypes = result.array;
      }
      this.isFetchingPaymentTypes = false;
    },
    async loadSettings() {
      this.isFetchingSettings = true;
      const result = await client.get("cart/messages").json<{
        object?: {
          messages: IMessages;
        };
      }>();
      if (result?.object) {
        this.messages = result.object.messages;
      }
      console.log("[loadSettings]", result?.object);
      this.isFetchingSettings = false;
    },
  },
});
