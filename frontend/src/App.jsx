import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import AddTaskForm from './components/AddTaskForm'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Ошибка при получении задачи:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks])
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Задачи загружаются...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Todo List</h1>
          <p className="text-gray-600">Не теряю возможность. Запиши самое главное!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Добавить новую задачу</h2>
              <AddTaskForm onTaskAdded={handleTaskAdded} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <TaskList 
                tasks={tasks}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App