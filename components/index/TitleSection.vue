<template>
    <div class="mb-8">
      <div class="flex items-center self-center justify-center">
        <img :src="logo" alt="logoAlt" class="mr-2 h-8 w-8" />
        <h1 class="text-4xl uppercase font-bold">{{ title }}</h1>
      </div>
      <p class="text-center mt-4">{{ description }}</p>
    </div>
  </template>

  <script setup>
  import logo from '~/assets/picture/trefle.png'

  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
  })
  </script>