export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1

    if (!query.query) {
        return { data: [], meta: { total: 0 } }
    }

    try {
        const apiUrl = `https://trefle.io/api/v1/plants?token=${config.public.trefleApiKey}&filter[common_name]=${query.query}&page=${page}&per_page=20`

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`API response status: ${response.status}`)
        }

        const data = await response.json()
        return data

    } catch (error) {
        console.error('Trefle API Error:', error)
        return {
            data: [],
            meta: { total: 0 }
        }
    }
})