<script setup lang="ts">
import { markRaw, ref, watchEffect, nextTick } from "vue";
import { useField } from "vee-validate";
import UiInput from "../ui/UiInput.vue";
import { useDelivery } from "../../store/delivery.store.ts";
import { IAddressObject } from "../../types/delivery.ts";
import CheckoutDeliverySelfForm from "./CheckoutDeliverySelfForm.vue";

var deliveryStore = useDelivery();

var deliveryTypes = markRaw([
  {
    type: "delivery",
    name: "Курьер",
  },
  {
    type: "self",
    name: "Самовывоз",
  },
]);

var { value: deliveryType, errorMessage } = useField("deliveryType");
var {
  value: deliveryAddress,
  handleChange: setDeliveryAddress,
  meta,
} = useField("deliveryAddress");
var {
  handleChange: setDeliveryObject,
  errorMessage: deliveryError,
  validate,
  setTouched,
} = useField("deliveryObject");
var filteredAddresses = ref<IAddressObject[]>([]);
var addressField = ref("");

watchEffect(() => {
  if (meta.touched && deliveryAddress.value) setTouched(true);
});

var search = async (event: { query: string }) => {
  const list = await deliveryStore.getSuggestions(event.query);
  if (list?.length) {
    filteredAddresses.value = list;
  } else {
    filteredAddresses.value = [];
  }
};

var itemSelect = (event: { value: IAddressObject }) => {
  setDeliveryObject(event.value);
  setDeliveryAddress(event.value.value);
  addressField.value = "";
  setTouched(true);
  nextTick(validate);
};
</script>

<template>
  <div class="t-mb-7 lg:t-mb-3">
    <div class="">
      <SelectButton
        v-model="deliveryType"
        :options="deliveryTypes"
        option-label="name"
        option-value="type"
      />
    </div>
    <span class="error-text">{{ errorMessage }}</span>
  </div>
  <div class="t-flex t-flex-col t-gap-3">
    <div
      v-if="deliveryType === 'delivery'"
      class="t-group autocomplete t-relative"
    >
      <span
        class="t-absolute input-label t-left-4 group-empty:t-top-auto group-empty:t-text-base t-top-1 t-text-[10px]"
        >Адрес доставки</span
      >
      <AutoComplete
        v-model="addressField"
        :suggestions="filteredAddresses"
        option-label="value"
        empty-search-message="Результатов не найдено"
        placeholder=""
        @complete="search"
        @itemSelect="itemSelect"
      />
      <svg
        class="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M13.0108 13.7179C11.7372 14.8278 10.0721 15.5 8.25 15.5C4.24594 15.5 1 12.2541 1 8.25C1 4.24594 4.24594 1 8.25 1C12.2541 1 15.5 4.24594 15.5 8.25C15.5 10.0721 14.8278 11.7372 13.7179 13.0108L19.8536 19.1464L19.1464 19.8536L13.0108 13.7179ZM14.5 8.25C14.5 11.7018 11.7018 14.5 8.25 14.5C4.79822 14.5 2 11.7018 2 8.25C2 4.79822 4.79822 2 8.25 2C11.7018 2 14.5 4.79822 14.5 8.25Z"
          fill="black"
        />
      </svg>
    </div>
    <CheckoutDeliverySelfForm v-else />
    <div>
      <UiInput
        name="deliveryAddress"
        label="Выбранный адрес доставки"
        readonly
      />
      <div v-if="deliveryError" class="error-text">{{ deliveryError }}</div>
    </div>
  </div>
</template>

<style>
.p-selectbutton {
  width: 100%;
  display: flex;
  gap: 6px;
}
.p-selectbutton .p-button {
  width: 100%;
  border-radius: 0;
}
.p-selectbutton .p-button[aria-checked="false"] {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}
.p-selectbutton .p-button.p-highlight {
  background-color: black;
  border-color: black;
}

.p-autocomplete {
  @apply t-border t-h-[48px] t-border-black t-relative t-px-4 t-pb-[10px] t-flex t-items-center;
}
.p-autocomplete-input {
  @apply t-rounded-none t-self-end t-text-base t-leading-[15px] focus:t-shadow-none t-w-full t-outline-none;
}
.search-icon {
  right: 12px;
  position: absolute;
  top: 14px;
}
.autocomplete:has(.p-autocomplete-loader) .search-icon {
  display: none;
}
</style>
