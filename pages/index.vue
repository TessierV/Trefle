<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8">Recherche de Plantes</h1>

        <!-- Search bar component -->
        <div class="max-w-xl mx-auto mb-8">
            <input v-model="searchQuery" type="text" placeholder="Rechercher une plante..."
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
        </div>

        <!-- Loading state indicator -->
        <div v-if="loading" class="text-center text-lg">
            Chargement des plantes...
        </div>

        <!-- Error message display -->
        <div v-if="error" class="text-red-500 text-center mb-4">
            {{ error }}
        </div>

        <!-- Plant Grid Component -->
        <PlantGrid
            :loading="loading"
            :plants="filteredPlants"
            @navigate="navigateToPlant"
        />

        <!-- No results message -->
        <div v-if="!loading && filteredPlants.length === 0" class="text-center text-slate-600 mt-8">
            Aucune plante trouvée pour "{{ searchQuery }}"
        </div>

        <!-- Pagination -->
        <Pagination
            v-if="!loading && totalPages > 0"
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="changePage"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Pagination from '~/components/index/Pagination.vue'
import PlantGrid from '~/components/index/PlantGrid.vue'

// State management with refs
const searchQuery = ref('')
const plants = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(0)
const itemsPerPage = 50

// Computed property for filtering plants based on search query
const filteredPlants = computed(() => {
    if (!searchQuery.value) return plants.value

    const query = searchQuery.value.toLowerCase()
    return plants.value.filter(plant => {
        const commonName = (plant.common_name || '').toLowerCase()
        const scientificName = (plant.scientific_name || '').toLowerCase()
        const family = (plant.family || '').toLowerCase()
        const genus = (plant.genus || '').toLowerCase()

        return commonName.includes(query) ||
            scientificName.includes(query) ||
            family.includes(query) ||
            genus.includes(query)
    })
})

// Load plants from API with pagination
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
        error.value = 'Erreur lors du chargement des plantes'
    } finally {
        loading.value = false
    }
}

// Handle page change
const changePage = async (newPage) => {
    if (newPage < 1 || newPage > totalPages.value) return
    currentPage.value = newPage
    await loadPlants(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Load initial data when component is mounted
onMounted(() => {
    loadPlants(1)
})

// Navigate to plant detail page
const navigateToPlant = (plantId) => {
    navigateTo(`/plant/${plantId}`)
}

// Handle image loading errors
const handleImageError = (e) => {
    e.target.src = '/placeholder-plant.jpg'
}

// Watch search query changes and reset pagination
watch(searchQuery, () => {
    if (currentPage.value !== 1) {
        changePage(1)
    }
})
</script>
