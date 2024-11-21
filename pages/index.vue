<template>
    <!-- Main container with responsive padding -->
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8">Recherche de Plantes</h1>

        <!-- Search bar component -->
        <div class="max-w-xl mx-auto mb-8">
            <input v-model="searchQuery" type="text" placeholder="Rechercher une plante..."
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <!-- Loading state indicator -->
        <div v-if="loading" class="text-center text-lg">
            Chargement des plantes...
        </div>

        <!-- Error message display -->
        <div v-if="error" class="text-red-500 text-center mb-4">
            {{ error }}
        </div>

        <!-- Grid layout for plant cards -->
        <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Plant card component with image and details -->
            <div v-for="plant in filteredPlants" :key="plant.id" @click="navigateToPlant(plant.id)"
                class="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <!-- Plant image container with overlay -->
                <div class="relative h-48">
                    <img :src="plant.image_url || '/placeholder-plant.jpg'" :alt="plant.common_name"
                        class="w-full h-full object-cover rounded-t-lg" @error="handleImageError" />
                    <!-- Overlay with plant name -->
                    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                        <h2 class="text-lg font-semibold">{{ plant.common_name || 'Nom inconnu' }}</h2>
                    </div>
                </div>
                <!-- Plant details section -->
                <div class="p-4">
                    <p class="text-gray-600 italic">{{ plant.scientific_name }}</p>
                    <div class="mt-2 flex flex-wrap gap-2">
                        <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            {{ plant.family }}
                        </span>
                        <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {{ plant.genus }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- No results message -->
        <div v-if="!loading && filteredPlants.length === 0" class="text-center text-gray-600 mt-8">
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
