<template>
    <div class="search-bar">
        <input type="text" :placeholder="placeholder" :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)" @keyup.enter="$emit('search')"
            class="search-input" />
        <button @click="$emit('search')" class="search-button">
            {{ buttonText }}
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Search...'
    },
    buttonText: {
        type: String,
        default: 'Search'
    }
})

defineEmits(['update:modelValue', 'search'])
</script>

<style scoped>
.search-bar {
    @apply max-w-xl mx-auto mb-8 flex gap-2;
}

.search-input {
    @apply flex-1 px-4 py-2 border rounded-lg;
    @apply focus:outline-none focus:ring-2 focus:ring-emerald-300;
}

.search-button {
    @apply px-6 py-2 bg-emerald-500 text-white rounded-lg;
    @apply hover:bg-emerald-600 transition-colors duration-300;
}
</style>
