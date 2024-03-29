import { defineStore } from "pinia";
import {IAddressObject, IDeliveryPoint, IDeliveryStore} from "../types/delivery";
import { client } from "../composables/api.client";
import { toast } from "vue3-toastify";

export const useDelivery = defineStore("delivery", {
  state: (): IDeliveryStore => ({
    controller: null,
    amount: 0,
    addressObject: null,
    isFetchingPoints: false,
    points: [],
    isLoading: false,
  }),
  actions: {
    abortDelivery() {
      if (this.controller) {
        this.controller.abort();
        this.controller = null;
        this.controller = new AbortController();
      }
    },
    async loadPoints() {
      this.isFetchingPoints = true;
      const result = await client.get("delivery/locations").json();
      if (result?.array && Array.isArray(result.array)) {
        this.points = result.array;
      }
      this.isFetchingPoints = false;
    },
    async calcDelivery(address: IAddressObject | IDeliveryPoint, total: number) {
      console.log('[calcDelivery] address', address)
      const payload = 'name' in address ? {
        country: address.address.country,
        region: '',
        city: address.address.city
      } : {
        country: address?.data?.country || "Россия",
        region: address?.data.region || "",
        city: address?.data.city || "",
      };
      this.isLoading = true;

      const result = await client
        .post("delivery/calculate", {
          json: {
            address: payload,
            total,
          },
        })
        .json<{ amount: number }>()
        .catch((error) => {
          if (error instanceof DOMException) {
          } else {
            console.log("getSuggestions Failed", error);
            toast.error(error.message ? error.message : "Ошибка");
          }
        });
      if (result?.amount) {
        this.amount = result.amount;
      }
      this.isLoading = false;
    },
    async getSuggestions(address: string) {
      const result = await client
        .post("delivery/suggestion", {
          json: {
            address,
          },
          signal: this.controller?.signal,
        })
        .json<{ suggestions: IAddressObject[] }>()
        .catch((error) => {
          if (error instanceof DOMException) {
          } else {
            console.log("getSuggestions Failed", error);
            toast.error(error.message ? error.message : "Ошибка");
          }
        });
      return result?.suggestions;
    },
  },
});
