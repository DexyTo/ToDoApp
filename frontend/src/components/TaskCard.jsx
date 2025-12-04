import { useState, useEffect } from 'react'
import { taskApi } from '../api'
import ImageUploader from './ImageUploader'

const TaskCard = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description || '')
  const [imageUrl, setImageUrl] = useState(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  const fetchImageUrl = async () => {
    if (!task.image_filename) return
    
    try {
      setIsLoadingImage(true)
      const response = await taskApi.getImageUrl(task.id)
      if (response.data.url) {
        setImageUrl(response.data.url)
      }
    } catch (error) {
      console.error('Error fetching image URL:', error)
    } finally {
      setIsLoadingImage(false)
    }
  }

  useEffect(() => {
    fetchImageUrl()
  }, [task.image_filename])

  const handleToggleComplete = async () => {
    try {
      const updatedTask = {
        ...task,
        is_completed: !task.is_completed,
        title: task.title,
        description: task.description || ''
      }
      const response = await taskApi.updateTask(task.id, updatedTask)
      onTaskUpdated(response.data)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    try {
      const updatedTask = {
        ...task,
        title: editedTitle,
        description: editedDescription,
        is_completed: task.is_completed
      }
      const response = await taskApi.updateTask(task.id, updatedTask)
      onTaskUpdated(response.data)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskApi.deleteTask(task.id)
      onTaskDeleted(task.id)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleImageUploaded = (filename) => {
    const updatedTask = { ...task, image_filename: filename }
    onTaskUpdated(updatedTask)
    fetchImageUrl()
  }

  return (
    <div className={`task-card p-6 ${task.is_completed ? 'completed bg-gray-50' : 'bg-white'}`}>
      {isEditing ? (
        <form onSubmit={handleUpdateTask} className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task title"
            required
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Description"
            rows="3"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleComplete}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    task.is_completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300'
                  }`}
                >
                  {task.is_completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div>
                  <h3 className={`text-lg font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>
              </div>
              
              {task.image_filename && (
                <div className="mt-4">
                  {isLoadingImage ? (
                    <div className="text-gray-500">Loading image...</div>
                  ) : imageUrl ? (
                    <div className="relative group">
                      <img
                        src={imageUrl}
                        alt="Task attachment"
                        className="w-32 h-32 object-cover rounded-lg shadow"
                      />
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      >
                        <span className="text-white text-sm">View full size</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-gray-400">Image not available</div>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center space-x-2">
                <ImageUploader 
                  taskId={task.id} 
                  onImageUploaded={handleImageUploaded}
                />
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
                <span className="text-xs text-gray-400">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TaskCard