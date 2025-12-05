import { useState, useRef } from 'react'
import { taskApi } from '../api'

const ImageUploader = ({ taskId, onImageUploaded }) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения')
      return
    }

    if (file.size > 16 * 1024 * 1024) { // 16MB limit
      alert('Размер файла должен быть не более 16 МБ')
      return
    }

    setIsUploading(true)
    try {
      const response = await taskApi.uploadImage(taskId, file)
      onImageUploaded(response.data.filename)
      alert('Изображение успешно загружено!')
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error)
      alert('Не удалось загрузить изображение. Пожалуйста, попробуйте снова.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="text-sm text-green-500 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Загрузка...' : 'Загрузить изображение'}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
    </>
  )
}

export default ImageUploader