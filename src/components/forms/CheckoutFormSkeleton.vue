<script setup lang="ts"></script>

<template>
  <div class="t-flex t-flex-col t-w-full t-gap-8 lg:t-gap-13 t-max-w-[576px]">
    <div class="t-flex t-flex-col t-gap-3">
      <h2 class="t-h2 t-pl-5 lg:t-pl-7 lg:t-mb-3">Получатель</h2>
      <Skeleton height="48px" border-radius="0" />
      <Skeleton height="48px" border-radius="0" />
      <Skeleton height="48px" border-radius="0" />
    </div>
    <div>
      <h2 class="t-h2 t-pl-5 lg:t-pl-7 t-mb-5">Доставка</h2>
      <div class="t-flex t-gap-1.5 lg:t-gap-2 t-mb-7 lg:t-mb-3">
        <Skeleton height="48px" border-radius="0" />
        <Skeleton height="48px" border-radius="0" />
      </div>
      <div class="t-flex t-flex-col t-gap-3">
        <Skeleton height="48px" border-radius="0" />
        <Skeleton height="48px" border-radius="0" />
      </div>
    </div>
    <div>
      <h2 class="t-h2 t-pl-5 lg:t-pl-7 t-mb-5">Способ оплаты</h2>
      <Skeleton height="48px" border-radius="0" />
    </div>
  </div>
</template>

<style scoped></style>
