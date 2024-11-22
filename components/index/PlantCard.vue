<template>
    <div @click="$emit('navigate', plant.id)"
        class="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-500 group">
        <!-- Plant image container with overlay -->
        <div class="relative h-48 overflow-hidden rounded-t-lg">
            <img :src="plant.image_url || noImage" :alt="plant.common_name" :class="[
                'w-full h-full rounded-t-lg object-cover transform-gpu group-hover:scale-110 transition-all duration-700 ease-in-out',
                plant.image_url ? 'object-center' : 'object-top'
            ]" @error="handleImageError" />
            <!-- Overlay with plant details -->
            <div class="absolute top-2 right-2 flex flex-wrap gap-2">
                <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {{ plant.family || 'Unknown name' }}
                </span>
                <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {{ plant.genus || 'Unknown name' }}
                </span>
            </div>
        </div>
        <!-- Plant name section -->
        <div class="mx-4 my-2">
            <h2 class="text-lg font-semibold">{{ plant.common_name || 'Unknown name' }}</h2>
            <p class="text-slate-400 italic">{{ plant.scientific_name || 'Unknown name' }}</p>
        </div>
    </div>
</template>

<script setup>
import noImage from '~/assets/picture/no-image.png'

const props = defineProps({
    plant: {
        type: Object,
        required: true
    }
})

defineEmits(['navigate'])

const handleImageError = (e) => {
    e.target.src = noImage
}
</script>