import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'

function Alert() {
  const { alert } = useAuth()

  if (!alert.show) return null

  return (
    <div className={`alert alert-${alert.type}`}>
      {alert.message}
    </div>
  )
}

export default Alert