export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1

  try {
      const url = new URL('https://trefle.io/api/v1/plants')
      url.searchParams.append('token', config.public.trefleApiKey)
      url.searchParams.append('page', page.toString())
      url.searchParams.append('per_page', '20')
      url.searchParams.append('order[common_name]', 'asc')

      const response = await fetch(url.toString(), {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      })

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data

  } catch (error) {
      console.error('Error fetching plants:', error)
      throw createError({
          statusCode: 500,
          message: 'Error while fetching plants'
      })
  }
})