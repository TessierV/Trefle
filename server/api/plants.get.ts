// server/api/plants.get.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    // Get page number from query params, default to 1 if not provided
    const page = parseInt(query.page as string) || 1

    try {
      // Make API call to Trefle plants endpoint with pagination and sorting
      const response = await fetch(
        `https://trefle.io/api/v1/plants?token=${config.public.trefleApiKey}&page=${page}&per_page=50&order[common_name]=asc`
      )

      // Check if the API response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data

    } catch (error) {
      console.error('Error fetching plants:', error)
      // Return appropriate error response
      throw createError({
        statusCode: 500,
        message: 'Error while fetching plants'
      })
    }
  })