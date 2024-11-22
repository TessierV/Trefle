export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const id = event.context.params.id

    try {
        // Build URL with URLSearchParams
        const params = new URLSearchParams({
            token: config.public.trefleApiKey
        })

        // Main request to get plant details
        const apiUrl = `https://trefle.io/api/v1/species/${id}?${params.toString()}`

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`API response status: ${response.status}`)
        }

        const data = await response.json()

        // Ensure essential fields are present with default values
        const plantData = {
            ...data.data,
            status: data.data.status || 'unknown',
            rank: data.data.rank || 'species',
            synonyms: data.data.synonyms || []
        }

        // Fetch family details if link exists
        if (data.data.links?.family) {
            try {
                const familyResponse = await fetch(`https://trefle.io${data.data.links.family}?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })

                if (familyResponse.ok) {
                    const familyData = await familyResponse.json()
                    plantData.family = familyData.data
                }
            } catch (error) {
                console.error('Error fetching family data:', error)
                plantData.family = { name: data.data.family }
            }
        }

        // Fetch genus details if link exists
        if (data.data.links?.genus) {
            try {
                const genusResponse = await fetch(`https://trefle.io${data.data.links.genus}?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })

                if (genusResponse.ok) {
                    const genusData = await genusResponse.json()
                    plantData.genus = genusData.data
                }
            } catch (error) {
                console.error('Error fetching genus data:', error)
                plantData.genus = { name: data.data.genus }
            }
        }

        // Validate required data before returning
        if (!plantData.scientific_name) {
            throw new Error('Invalid plant data: missing scientific name')
        }

        return {
            data: plantData,
            links: data.links,
            meta: data.meta
        }

    } catch (error) {
        console.error('Trefle API Error:', error)
        throw createError({
            statusCode: error.response?.status || 404,
            message: error.message || 'Plant not found'
        })
    }
})
