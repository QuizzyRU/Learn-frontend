import { useState, useEffect } from 'react'
import TaskCard from '../components/tasks/TaskCard'
import api from '../api/client'

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        const response = await api.task.getAll()
        setTasks(response.result || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  console.log(tasks)

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>SQL тренажер</h1>
        <p>
          Улучшайте свои навыки SQL через практические задания. 
          Решайте задачи, получайте очки и становитесь экспертом в SQL.
        </p>
      </div>
      
      <div>
        <h2>Доступные задания</h2>
        
        <div className="task-grid">
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <p>Нет доступных заданий</p>
          )}
        </div>
      </div>
    </div>
  )
}