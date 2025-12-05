import TaskCard from './TaskCard'

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Задач пока нет. Добавьте свою первую!</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  )
}

export default TaskList