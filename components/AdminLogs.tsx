'use client'

import { useEffect, useState } from 'react'

interface LogEntry {
  event: string
  data: Record<string, any>
  timestamp: string
  user_id?: string
  session_id?: string
  created_at: string
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    fetchLogs()
    // Refresh every 10 seconds
    const interval = setInterval(fetchLogs, 10000)
    return () => clearInterval(interval)
  }, [filter])

  const fetchLogs = async () => {
    try {
      const url = filter ? `/api/log?event=${filter}&limit=100` : '/api/log?limit=100'
      const response = await fetch(url)
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const uniqueEvents = Array.from(new Set(logs.map((log) => log.event)))

  return (
    <div
      style={{
        padding: 16,
        background: '#f4f8fb',
        borderRadius: 14,
        marginTop: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Dashboard de Logs</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #ddd',
            background: '#fff',
          }}
        >
          <option value="">Todos los eventos</option>
          {uniqueEvents.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 20 }}>Cargando logs...</div>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>No hay logs disponibles</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#e5e7eb', borderBottom: '2px solid #d1d5db' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Evento</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Datos</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Usuario</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    background: i % 2 === 0 ? '#fff' : '#f9fafb',
                  }}
                >
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1f2937' }}>{log.event}</td>
                  <td style={{ padding: '8px 12px', color: '#4b5563' }}>
                    <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </td>
                  <td style={{ padding: '8px 12px', color: '#6b7280', fontSize: '12px' }}>
                    {log.user_id ? log.user_id.substring(0, 8) + '...' : 'Anónimo'}
                  </td>
                  <td style={{ padding: '8px 12px', color: '#6b7280', fontSize: '12px' }}>
                    {formatDate(log.timestamp || log.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>
        Total: {logs.length} logs | Actualizando cada 10 segundos
      </div>
    </div>
  )
}

