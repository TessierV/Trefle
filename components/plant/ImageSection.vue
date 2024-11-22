<template>
    <div class="image-section">
        <div class="image-container" :style="{ backgroundImage: `url(${imageUrl})` }">
            <div class="badge-container">
                <span v-if="family" class="badge badge-green">{{ family }}</span>
                <span v-if="genus" class="badge badge-blue">{{ genus }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    imageUrl: {
        type: String,
        default: '~/assets/picture/no-image.png'
    },
    family: String,
    genus: String
})
</script>

<style scoped>
.image-section {
    @apply w-full lg:w-1/3 flex-shrink-0;
}

.image-container {
    @apply relative h-[50vh] lg:h-[90dvh] bg-cover shadow-xl bg-local bg-center rounded-lg overflow-hidden;
}

.badge-container {
    @apply absolute top-4 right-4 flex gap-2;
}

.badge {
    @apply text-sm px-2 py-1 rounded;
}

.badge-green {
    @apply bg-green-100 text-green-800;
}

.badge-blue {
    @apply bg-blue-100 text-blue-800;
}
</style>
