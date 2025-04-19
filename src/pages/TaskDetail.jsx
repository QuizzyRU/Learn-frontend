import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DatabaseViewer from '../components/tasks/DatabaseViewer'
import api from '../api/client'

export default function TaskDetail() {
  const { id } = useParams()
  const [answer, setAnswer] = useState('')
  const [sqlQuery, setSqlQuery] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [taskData, setTaskData] = useState(null)
  const [dbStructure, setDbStructure] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [taskResponse, dbResponse] = await Promise.all([
          api.task.getById(id),
          api.task.visualizeDb(id)
        ])
        setTaskData(taskResponse)
        setDbStructure(dbResponse)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const executeQuery = async () => {
    try {
      const result = await api.task.executeQuery(id, sqlQuery)
      setQueryResult(result.result)
      alert('Запрос выполнен успешно!')
    } catch (error) {
      alert(error.message || 'Ошибка при выполнении запроса')
    }
  }

  const submitSolution = async () => {
    try {
      await api.task.solve(id, answer)
      alert('Ответ отправлен успешно!')
      await navigate("/profile")
    } catch (error) {
      alert(error.message || 'Ошибка при отправке ответа')
    }
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>
  if (!taskData?.task) return <div>Задание не найдено</div>

  const task = taskData.task

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h1 style={{ margin: 0 }}>{task.name}</h1>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ padding: '4px 8px', backgroundColor: '#eee', borderRadius: '4px' }}>{task.level}</span>
                <span>{task.price} очков</span>
              </div>
            </div>
            <p>{task.description}</p>
          </div>

          {/* SQL редактор */}
          <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
            <h2>SQL Запрос</h2>
            <div>
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="SELECT * FROM users..."
                style={{ fontFamily: 'monospace' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={executeQuery} disabled={!sqlQuery.trim()}>
                  Выполнить запрос
                </button>
              </div>
            </div>

            {/* Результаты запроса */}
            {queryResult && (
              <div style={{ marginTop: '1rem' }}>
                <h3>Результаты запроса</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        {queryResult[0] && Object.keys(queryResult[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((value, j) => (
                            <td key={j} style={{ fontFamily: 'monospace' }}>
                              {value?.toString() ?? 'NULL'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Ответ */}
          <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <h2>Ваш ответ</h2>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Введите ваш ответ..."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={submitSolution} disabled={!answer.trim()}>
                Отправить ответ
              </button>
            </div>
          </div>
        </div>

        {/* Структура БД */}
        <div style={{ border: '1px solid #ccc', padding: '1rem', height: 'fit-content' }}>
          <h2>Структура базы данных</h2>
          {dbStructure && <DatabaseViewer structure={dbStructure.structure} />}
        </div>
      </div>
    </div>
  )
}