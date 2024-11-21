// server/api/search.get.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    try {
      // Make API call to Trefle search endpoint
      const response = await fetch(`https://trefle.io/api/v1/plants/search?token=${config.public.trefleApiKey}&q=${query.q}`)
      const data = await response.json()

      // Check if the API response is successful
      if (!response.ok) {
        throw new Error(`API response status: ${response.status}`)
      }

      return data

    } catch (error) {
      console.error('Trefle API Error:', error)
      // Return appropriate error response
      throw createError({
        statusCode: 500,
        message: 'Error while searching plants'
      })
    }
  })