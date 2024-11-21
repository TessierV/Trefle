<template>
    <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <PlantCard v-for="plant in plants" :key="plant.id" :plant="plant" @navigate="$emit('navigate', $event)" />
    </div>
</template>

<script setup>
import PlantCard from './PlantCard.vue'

defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    plants: {
        type: Array,
        required: true
    }
})

defineEmits(['navigate'])
</script>