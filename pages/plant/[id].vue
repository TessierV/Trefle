<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="text-center text-lg">
      Loading the plant...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-red-500 text-center mb-4">
      {{ error }}
    </div>

    <!-- Main content when plant is loaded -->
    <div v-else-if="plant" class="mx-auto">
      <!-- Main container - flex-col on mobile, flex-row on desktop -->
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Image Section - full width on mobile, 1/3 on desktop -->
        <div class="w-full lg:w-1/3 flex-shrink-0 bg-fixed">
          <div class="relative h-[50vh] lg:h-[90dvh] bg-cover shadow-xl bg-local bg-center rounded-lg overflow-hidden"
            :style="{
              backgroundImage: `url(${plant.image_url || noImage})`,
            }">
            <!-- Family and Genus badges -->
            <div class="absolute top-4 right-4 flex gap-2">
              <span v-if="plant.family" class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {{ plant.family }}
              </span>
              <span v-if="plant.genus" class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {{ plant.genus.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Content Section - full width on mobile, 2/3 on desktop -->
        <div class="w-full lg:w-2/3 bg-white rounded-lg shadow-xl">
          <div class="p-4 lg:p-6">
            <!-- Header Section -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 class="text-2xl lg:text-4xl font-bold mb-2">{{ plant.common_name || 'Unknown name' }}</h1>
                <p class="text-lg lg:text-xl text-emerald-600 italic">{{ plant.scientific_name || 'Unknown name' }}</p>
              </div>
              <button @click="router.back()" class="text-slate-400 hover:text-emerald-400 transition-colors">
                Back
              </button>
            </div>

            <!-- Content Layout -->
            <div class="flex flex-col gap-6">
              <!-- Main Information -->
              <div class="w-full">
                <h2 class="text-l uppercase font-bold mb-4">Main Information</h2>
                <div class="flex flex-col sm:flex-row gap-6">
                  <!-- First column - Taxonomic information -->
                  <div class="w-full sm:flex-1 space-y-2">
                    <p v-if="plant.family?.name"><span class="font-medium">Family :</span> {{ plant.family.name }}</p>
                    <p v-if="plant.family_common_name"><span class="font-medium">Family common name :</span> {{
                      plant.family_common_name }}</p>
                    <p v-if="plant.genus?.name"><span class="font-medium">Genus :</span> {{ plant.genus.name }}</p>
                    <p v-if="plant.status"><span class="font-medium">Status : </span>
                      <span v-if="plant.status === 'accepted'">Accepted</span>
                      <span v-else-if="plant.status === 'unknown'">Unknow</span>
                      <span v-else>{{ plant.status }}</span>
                    </p>
                    <p v-if="plant.rank"><span class="font-medium">Rank : </span>
                      <span v-if="plant.rank === 'species'">Species</span>
                      <span v-else-if="plant.rank === 'subspecies'">Subspecies</span>
                      <span v-else-if="plant.rank === 'variety'">Variety</span>
                      <span v-else-if="plant.rank === 'form'">Form</span>
                      <span v-else-if="plant.rank === 'hybrid'">Hybrid</span>
                      <span v-else>{{ plant.rank }}</span>
                    </p>
                  </div>
                  <!-- Second column - Publication details -->
                  <div class="w-full sm:flex-1 space-y-2">
                    <p v-if="plant.observations"><span class="font-medium">Observations :</span> {{ plant.observations
                      }}</p>
                    <p v-if="plant.year"><span class="font-medium">Year of First Publication :</span> {{ plant.year
                      }}</p>
                    <p v-if="plant.author"><span class="font-medium">Author(s) :</span> {{ plant.author }}</p>
                    <p v-if="plant.bibliography"><span class="font-medium">Bibliographic Reference :</span> {{
                      plant.bibliography }}</p>
                  </div>
                </div>
              </div>

              <!-- Common Names and Sources Section -->
              <div class="flex flex-col sm:flex-row gap-6">
                <!-- Common Names -->
                <div class="w-full sm:flex-1 space-y-2">
                  <h2 class="text-l uppercase font-bold mb-4">Common Names</h2>
                  <div v-if="plant.common_names">
                    <ul class="list-disc list-inside">
                      <li v-for="(names, lang) in plant.common_names" :key="lang">
                        {{ lang }} : {{ names.join(', ') }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Sources -->
                <div class="w-full sm:flex-1 space-y-2">
                  <h2 class="text-l uppercase font-bold mb-4">Sources</h2>
                  <div v-if="plant.sources?.length">
                    <ul class="list-disc list-inside">
                      <li v-for="source in plant.sources" :key="source.id">
                        <a :href="source.url" target="_blank" class="text-emerald-600 hover:underline">{{ source.name
                          }}<br></a>
                        <i class="text-s">{{ source.citation }}</i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Synonyms Section -->
              <div class="w-full">
                <h2 class="text-l uppercase font-bold mb-4">Synonyms</h2>
                <div v-if="plant.synonyms?.length" class="max-h-60 scrollbar-thin overflow-y-auto">
                  <ul class="list-disc list-inside space-y-1 text-slate-700">
                    <li v-for="synonym in plant.synonyms" :key="synonym">
                      {{ synonym.name }} | {{ synonym.author }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import noImage from '~/assets/picture/no-image.png'

// Router setup
const router = useRouter()
const route = useRoute()

// State management
const plant = ref(null)
const loading = ref(true)
const error = ref(null)

// Lifecycle hooks
onMounted(async () => {
  try {
    const response = await $fetch(`/api/plant/${route.params.id}`)
    plant.value = response.data
  } catch (err) {
    console.error('Error loading plant:', err)
    error.value = 'Oops, there was an issue loading the plant'
  } finally {
    loading.value = false
  }
})

// Event handlers
const handleImageError = (e) => {
  e.target.src = noImage
}
</script>