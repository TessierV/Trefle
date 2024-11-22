<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Title Section -->
        <TitleSection title="Trefle API"
            description="Type the name of a plant or flower and press submit to see the result." />

        <!-- Search bar with button -->
        <SearchBar v-model="searchQuery" placeholder="Search for a plant..." button-text="Search"
            @search="handleSearch" />

        <!-- Loading state indicator -->
        <div v-if="loading" class="text-center text-lg">
            Loading the plant...
        </div>

        <!-- Error message display -->
        <div v-if="error" class="text-red-500 text-center mb-4">
            {{ error }}
        </div>

        <!-- Plant Grid Component -->
        <PlantGrid :loading="loading" :plants="plants" @navigate="navigateToPlant" />

        <!-- No results message -->
        <div v-if="!loading && plants.length === 0" class="text-center text-slate-600 mt-8">
            No plant found for "{{ searchQuery }}"
        </div>

        <!-- Pagination -->
        <Pagination v-if="!loading && totalPages > 0" :current-page="currentPage" :total-pages="totalPages"
            @change="changePage" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import TitleSection from '~/components/index/TitleSection.vue'
import SearchBar from '~/components/index/SearchBar.vue'
import Pagination from '~/components/index/Pagination.vue'
import PlantGrid from '~/components/index/PlantGrid.vue'

const searchQuery = ref('')
const plants = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(0)
const itemsPerPage = 20

// Watch searchQuery for empty state
watch(searchQuery, (newValue) => {
    if (!newValue.trim()) {
        currentPage.value = 1
        loadPlants(1)
    }
})

// Function to format search query
const formatSearchQuery = (query) => {
    return query.trim().split(' ').join('%20')
}

// Handle search
const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
        currentPage.value = 1
        loadPlants(1)
        return
    }

    try {
        loading.value = true
        error.value = null
        const formattedQuery = formatSearchQuery(searchQuery.value)

        const response = await $fetch('/api/search', {
            params: {
                query: formattedQuery,
                page: currentPage.value
            }
        })

        plants.value = response.data || []
        totalPages.value = Math.ceil((response.meta?.total || 0) / itemsPerPage)
        currentPage.value = 1

    } catch (err) {
        console.error('Error during search:', err)
        error.value = 'Oops, there was an issue during the search.'
        plants.value = []
    } finally {
        loading.value = false
    }
}

const changePage = async (newPage) => {
    currentPage.value = newPage
    if (searchQuery.value.trim()) {
        await handleSearch()
    } else {
        await loadPlants(newPage)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const navigateToPlant = (plantId) => {
    navigateTo(`/plant/${plantId}`)
}

const loadPlants = async (page = 1) => {
    try {
        loading.value = true
        const response = await $fetch('/api/plants', {
            params: { page }
        })
        plants.value = response.data
        totalPages.value = Math.ceil(response.meta.total / itemsPerPage)
    } catch (err) {
        console.error('Error loading plants:', err)
        error.value = 'Oops, there was an issue loading the plant.'
    } finally {
        loading.value = false
    }
}

// Initial load
loadPlants(1)
</script>
