<script setup lang="ts">
import {
  YandexMap, YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
} from "vue-yandex-maps";
import { ref, shallowRef, onMounted } from "vue";
import type { YMap } from "@yandex/ymaps3-types";
import { useDelivery } from "../../store/delivery.store.ts";
import { storeToRefs } from "pinia";
import {useField} from "vee-validate";
import {IDeliveryPoint} from "../../types/delivery.ts";

var map = shallowRef<null | YMap>(null);
var settings = ref({
  location: {
    center: [37.617644, 55.755819],
    zoom: 9,
  },
});

const deliveryStore = useDelivery();
const { points, isFetchingPoints } = storeToRefs(deliveryStore);

const {handleChange: setDeliveryObject} = useField('deliveryObject')
const {handleChange: setDeliveryAddress} = useField('deliveryAddress')

onMounted(() => {
  deliveryStore.loadPoints();
});

var selectPoint = (point: IDeliveryPoint) => {
  setDeliveryObject(point)
  setDeliveryAddress(point.name)
}
</script>

<template>
  <div class="map-container">
    <yandex-map v-model="map" width="100%" :settings="settings">
      <yandex-map-default-scheme-layer />
      <yandex-map-default-features-layer />
      <template v-for="point of points" :key="point.id">
        <yandex-map-marker
          position="top left"
          :settings="{
            coordinates: [point.address.longitude, point.address.latitude],
            id: point.id,
            properties: {},
          }"
        >
          <div
            class="icon t-cursor-pointer"
            @click="selectPoint(point)"
            :style="{
              position: 'relative',
              width: 'size' in point ? point.size : '20px',
              height: 'size' in point ? point.size : '20px',
              color: 'color' in point && point.color,
              background: 'no-repeat center center',
              backgroundSize: 'contain',
              backgroundImage: 'icon' in point && `url(${point.icon})`,
            }"
          >
            <div
              class="icon_title"
              :style="{
                position: 'absolute',
                top: '120%',
                left: '50%',
                fontSize: '10px',
                padding: '2px 4px',
                textAlign: 'center',
                backgroundColor: '#fff',
                transform: 'translateX(-50%)',
              }"
              v-html="point.name"
            ></div>
          </div>
        </yandex-map-marker>
      </template>
    </yandex-map>
  </div>
</template>

<style scoped>
.map-container {
  aspect-ratio: 16/9;
}
</style>
