import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_URL, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem(AUTH_TOKEN_KEY)
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
          if (refreshToken) {
            try {
              const response = await this.client.post('/auth/refresh', {
                refresh_token: refreshToken,
              })
              const { access_token, refresh_token: new_refresh_token } = response.data.data
              localStorage.setItem(AUTH_TOKEN_KEY, access_token)
              localStorage.setItem(REFRESH_TOKEN_KEY, new_refresh_token)
              
              // Retry the original request
              if (error.config) {
                error.config.headers.Authorization = `Bearer ${access_token}`
                return this.client.request(error.config)
              }
            } catch {
              // Refresh failed, redirect to login
              if (typeof window !== 'undefined') {
                localStorage.clear()
                window.location.href = '/login'
              }
            }
          } else {
            // No refresh token, redirect to login
            if (typeof window !== 'undefined') {
              localStorage.clear()
              window.location.href = '/login'
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url)
    return response.data
  }
}

export const apiClient = new ApiClient()
