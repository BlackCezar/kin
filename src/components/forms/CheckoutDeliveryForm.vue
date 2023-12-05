<script setup>
import {markRaw} from "vue";
import {useField} from "vee-validate";
import UiInput from "../ui/UiInput.vue";

var deliveryTypes = markRaw([{
  type: 'delivery',
  name: 'Курьер'
}, {
  type: 'self',
  name: 'Самовывоз'
}])

var {value: deliveryType, errorMessage} = useField('deliveryType')
</script>

<template>
  <div class="t-mb-7 lg:t-mb-3">
  <div class="">
      <SelectButton v-model="deliveryType" :options="deliveryTypes" option-label="name" option-value="type" />
  </div>
  <span class="error-text">{{errorMessage}}</span>
  </div>
  <div class="t-flex t-flex-col t-gap-3">
    <AutoComplete v-model="selectedAddress" suggestions="filteredCountries" @complete="search" />
    <UiInput name="deliveryAddress" label="Выбранный адрес доставки" readonly />
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
  background-color: rgba(0,0,0,0.5);
  color: white;
}
.p-selectbutton .p-button.p-highlight {
  background-color: black;
  border-color: black;
}
</style>