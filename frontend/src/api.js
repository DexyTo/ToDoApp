import axios from 'axios'

const API_BASE_URL = ''

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const taskApi = {
  getTasks: () => api.get('/api/tasks'),
  getTask: (id) => api.get(`/api/tasks/${id}`),
  createTask: (taskData) => api.post('/api/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/api/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),

  uploadImage: (id, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    return api.post(`/api/tasks/${id}/upload_image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  getImageUrl: (id) => api.get(`/api/tasks/${id}/image_url`),
}

export default api