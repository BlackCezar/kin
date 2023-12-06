<script setup lang="ts">
import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
} from "vue-yandex-maps";
import { ref, shallowRef, onMounted } from "vue";
import type { YMap } from "@yandex/ymaps3-types";
import { useDelivery } from "../../store/delivery.store.ts";
import { storeToRefs } from "pinia";

var map = shallowRef<null | YMap>(null);
var settings = ref({
  location: {
    center: [37.617644, 55.755819],
    zoom: 9,
  },
});

const deliveryStore = useDelivery();
const { points, isFetchingPoints } = storeToRefs(deliveryStore);

onMounted(() => {
  deliveryStore.loadPoints();
});
</script>

<template>
  <div class="map-container">
    <yandex-map v-model="map" width="100%" :settings="settings">
      <yandex-map-default-scheme-layer />
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
            class="icon"
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
                padding: '2px 4px',
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
