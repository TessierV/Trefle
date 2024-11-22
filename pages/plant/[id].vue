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
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Left Column -->
        <ImageSection :image-url="plant.image_url || noImage" :family="plant.family" :genus="plant.genus?.name" />
        <!-- Right Column -->
        <ContentSection>
          <!-- Header Information -->
          <HeaderSection :title="plant.common_name || 'Unknown name'"
            :subtitle="plant.scientific_name || 'Unknown name'">
            <template #actions>
              <button @click="router.back()" class="text-slate-400 hover:text-emerald-400 transition-colors">
                Back
              </button>
            </template>
          </HeaderSection>
          <!-- Main Information -->
          <InfoSection title="Main Information">
            <div class="w-full sm:flex-1 space-y-2">
              <p v-if="plant.family?.name"><span class="font-medium">Family :</span> {{ plant.family.name }}</p>
              <p v-if="plant.family_common_name"><span class="font-medium">Family common name :</span> {{
                plant.family_common_name
                }}</p>
              <p v-if="plant.genus?.name"><span class="font-medium">Genus :</span> {{ plant.genus.name }}</p>
              <p v-if="plant.status"><span class="font-medium">Status : </span>
                <span v-if="plant.status === 'accepted'">Accepted</span>
                <span v-else-if="plant.status === 'unknown'">Unknown</span>
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
            <div class="w-full sm:flex-1 space-y-2">
              <p v-if="plant.observations"><span class="font-medium">Observations :</span> {{ plant.observations }}</p>
              <p v-if="plant.year"><span class="font-medium">Year of First Publication :</span> {{ plant.year }}</p>
              <p v-if="plant.author"><span class="font-medium">Author(s) :</span> {{ plant.author }}</p>
              <p v-if="plant.bibliography"><span class="font-medium">Bibliographic Reference :</span> {{
                plant.bibliography }}</p>
            </div>
          </InfoSection>
          <!-- Common Information -->
          <InfoSection title="Common Names">
            <div class="w-full sm:flex-1 space-y-2">
              <div v-if="plant.common_names" class="max-h-60 scrollbar-thin overflow-y-auto">
                <ul class="list-disc list-inside">
                  <li v-for="(names, lang) in plant.common_names" :key="lang">
                    {{ lang }} : {{ names.join(', ') }}
                  </li>
                </ul>
              </div>
            </div>
          </InfoSection>
          <!-- Sources Information -->
          <InfoSection title="Sources">
            <div class="w-full sm:flex-1 space-y-2">
              <div v-if="plant.sources?.length" class="max-h-60 scrollbar-thin overflow-y-auto">
                <ul class="list-disc list-inside">
                  <li v-for="source in plant.sources" :key="source.id">
                    <a :href="source.url" target="_blank" class="text-emerald-600 hover:underline">{{ source.name }}</a>
                    <br>
                    <i class="text-s">{{ source.citation }}</i>
                  </li>
                </ul>
              </div>
            </div>
          </InfoSection>
          <!-- Synonyms Information -->
          <InfoSection title="Synonyms">
            <div class="w-full">
              <div v-if="plant.synonyms?.length" class="max-h-60 scrollbar-thin overflow-y-auto">
                <ul class="list-disc list-inside space-y-1 text-slate-700">
                  <li v-for="synonym in plant.synonyms" :key="synonym">
                    {{ synonym.name }} | {{ synonym.author }}
                  </li>
                </ul>
              </div>
            </div>
          </InfoSection>
        </ContentSection>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ImageSection from '~/components/plant/ImageSection.vue'
import ContentSection from '~/components/plant/ContentSection.vue'
import HeaderSection from '~/components/plant/HeaderSection.vue'
import InfoSection from '~/components/plant/InfoSection.vue'
import noImage from '~/assets/picture/no-image.png'


const router = useRouter()
const route = useRoute()
const plant = ref(null)
const loading = ref(true)
const error = ref(null)


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

</script>
