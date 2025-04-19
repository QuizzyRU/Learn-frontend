import { useNavigate } from 'react-router-dom'
import api  from '../../api/client'

export default function TaskCard({ task }) {
  const navigate = useNavigate()

  function handleClick(task_id) {
    api.task.startTask(task_id)
      .then((response) => {
        console.log('Task started:', response)
        if (response.status == "started") {
          navigate(`/task/${response.id}`)
        } else {
          alert('Ошибка при запуске задания')
        }
      })
      .catch((error) => {
        console.error('Error starting task:', error)
        alert('Ошибка при запуске задания')
      })
  }

  return (
    <div className="task-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ padding: '4px 8px', backgroundColor: '#eee', borderRadius: '4px' }}>{task.level}</span>
        <span>{task.price} очков</span>
      </div>

      <h3 style={{ margin: '0.5rem 0' }}>{task.name}</h3>
      <p style={{ marginBottom: '1rem' }}>{task.description}</p>

      <button 
        onClick={handleClick.bind(null, task.id)}
        style={{ width: '100%' }}
      >
        Начать задание
      </button>
    </div>
  )
}