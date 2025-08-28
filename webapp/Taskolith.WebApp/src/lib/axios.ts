import axios from 'axios'

const apiClient = axios.create({
    baseURL: import.meta.env.DEV ? '/api' : '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

export default apiClient
