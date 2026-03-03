import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3001',
  headers: { 'x-admin-token': process.env.API_SECRET },
})

export const getRates = () => api.get('/api/rates')
export const getOrder = (ref: string) => api.get(`/api/orders/${ref}`)
export const createOrder = (data: any) => api.post('/api/orders', data)
export const approveOrder = (id: string) => api.post(`/api/admin/orders/${id}/approve`)
export const rejectOrder = (id: string, reason: string) =>
  api.post(`/api/admin/orders/${id}/reject`, { reason })
export const completeOrder = (id: string, txHash: string) =>
  api.post(`/api/admin/orders/${id}/complete`, { txHash })
export const freezeOrder = (id: string, reason: string) =>
  api.post(`/api/admin/orders/${id}/freeze`, { reason })
