<template>
    <div class="header-section">
        <div>
            <h1 class="title">{{ title }}</h1>
            <p class="subtitle">{{ subtitle }}</p>
        </div>
        <slot name="actions"></slot>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    subtitle: String
})
</script>

<style scoped>
.header-section {
    @apply flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4;
}

.title {
    @apply text-2xl lg:text-4xl font-bold mb-2;
}

.subtitle {
    @apply text-lg lg:text-xl text-emerald-600 italic;
}
</style>
