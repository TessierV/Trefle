<template>
    <div class="mt-8  flex justify-center items-center gap-2">
        <!-- Previous buttons group -->
        <div class="flex gap-2">
            <button @click="$emit('change', 1)" :disabled="currentPage === 1"
                class="pagination-button w-5 sm:w-12 px-2">
                <i class="fas fa-angle-double-left text-sm"></i>
            </button>
            <button @click="$emit('change', currentPage - 1)" :disabled="currentPage === 1"
                class="pagination-button w-5 sm:w-24">
                <span class="hidden sm:inline">Précédent</span>
                <i class="sm:hidden fas fa-angle-left text-sm"></i>
            </button>
        </div>

        <!-- Page number input section -->
        <div class="flex items-center gap-1">
            <span class="text-slate-400 select-none">Page</span>
            <input v-model="localPageInput" type="text" @input="validatePageInput" @change="handlePageInput"
                class="w-14 px-2 py-1 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500" />
            <span class="text-slate-400 select-none">sur {{ totalPages }}</span>
        </div>

        <!-- Next buttons group -->
        <div class="flex gap-2">
            <button @click="$emit('change', currentPage + 1)" :disabled="currentPage === totalPages"
                class="pagination-button w-5 sm:w-24">
                <span class="hidden sm:inline">Suivant</span>
                <i class="sm:hidden fas fa-angle-right text-sm"></i>
            </button>
            <button @click="$emit('change', totalPages)" :disabled="currentPage === totalPages"
                class="pagination-button w-5 sm:w-12 px-2">
                <i class="fas fa-angle-double-right text-sm"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props definition
const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    }
})

// Emits definition
const emit = defineEmits(['change'])

// Local state
const localPageInput = ref(props.currentPage.toString())

// Methods
const validatePageInput = () => {
    localPageInput.value = localPageInput.value.replace(/[^\d]/g, '')

    if (localPageInput.value === '') {
        localPageInput.value = '1'
    }

    const num = parseInt(localPageInput.value)
    if (num > props.totalPages) {
        localPageInput.value = props.totalPages.toString()
    }
}

const handlePageInput = () => {
    const newPage = parseInt(localPageInput.value)

    if (!isNaN(newPage) && newPage >= 1 && newPage <= props.totalPages) {
        emit('change', newPage)
    } else {
        localPageInput.value = props.currentPage.toString()
    }
}

// Watch for external changes
watch(() => props.currentPage, (newValue) => {
    localPageInput.value = newValue.toString()
})
</script>

<style scoped>
.pagination-button {
    @apply disabled:opacity-0 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all duration-300 ease-in-out;
}
</style>