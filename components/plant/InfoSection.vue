<template>
    <div class="w-full mt-4">
        <h2 class="text-l uppercase font-bold mb-4">{{ title }}</h2>
        <div class="flex flex-col sm:flex-row gap-6">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String
})
</script>
